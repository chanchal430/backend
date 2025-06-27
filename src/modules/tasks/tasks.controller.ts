import { Request, Response } from 'express';
import { db } from '../../config/db';

// Valid task types and platforms
const VALID_TASK_TYPES = ['daily', 'weekly', 'monthly', 'promos'];
const VALID_PLATFORMS = ['twitter', 'telegram', 'discord', 'website', 'other'];

export async function getTasks(req: Request, res: Response) {
  try {
    const { type, platform } = req.query;
    let query = 'SELECT * FROM social_tasks WHERE is_active = true';
    const queryParams = [];

    // Add type filter
    if (type && VALID_TASK_TYPES.includes(type as string)) {
      query += ' AND type = $1';
      queryParams.push(type);
    }

    // Add platform filter
    if (platform && VALID_PLATFORMS.includes(platform as string)) {
      query += ` ${queryParams.length > 0 ? 'AND' : 'WHERE'} platform = $${queryParams.length + 1}`;
      queryParams.push(platform);
    }

    query += ' ORDER BY id DESC';

    const { rows } = await db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function completeTask(req: any, res: any) {
  try {
    const userId = req.user?.id;
    const taskId = parseInt(req.params.id);
    const { proof } = req.body;

    if (!userId || isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Verify task exists and is active
    const taskResult = await db.query(
      `SELECT * FROM social_tasks 
       WHERE id = $1 AND is_active = true 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [taskId]
    );
    
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found, expired, or inactive' });
    }
    
    const task = taskResult.rows[0];
    
    // Check for existing completion
    const existingResult = await db.query(
      `SELECT id FROM social_task_completions 
       WHERE task_id = $1 AND user_id = $2`,
      [taskId, userId]
    );
    
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Task already completed' });
    }
    
    // Record completion
    await db.query(
      `INSERT INTO social_task_completions (task_id, user_id, proof)
       VALUES ($1, $2, $3)`,
      [taskId, userId, proof]
    );
    
    // Update points
    await db.query(
      `UPDATE users SET points = points + $1 
       WHERE id = $2`,
      [task.reward, userId]
    );
    
    // Get updated points
    const userResult = await db.query(
      'SELECT points FROM users WHERE id = $1',
      [userId]
    );
    
    res.json({ 
      success: true,
      reward: task.reward,
      newPoints: userResult.rows[0]?.points || 0
    });
  } catch (error) {
    console.error('Task completion failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const createTask = async (req: any, res: any) => {
  try {
    const { platform, type, url, reward, expiresAt, description } = req.body;
    const errors = [];

    // Validation
    if (!description) errors.push('description is required');
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      errors.push(`platform must be one of: ${VALID_PLATFORMS.join(', ')}`);
    }
    if (!type || !VALID_TASK_TYPES.includes(type)) {
      errors.push(`type must be one of: ${VALID_TASK_TYPES.join(', ')}`);
    }
    if (!reward || isNaN(reward) || reward <= 0) {
      errors.push('reward must be a positive number');
    }
    if (expiresAt && isNaN(Date.parse(expiresAt))) {
      errors.push('expiresAt must be a valid date string');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const { rows } = await db.query(
      `INSERT INTO social_tasks 
        (platform, type, url, reward, expires_at, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        platform, 
        type, 
        url || null, 
        parseFloat(reward),
        expiresAt ? new Date(expiresAt) : null,
        description
      ]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
