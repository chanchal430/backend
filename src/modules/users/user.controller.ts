import { Request, Response } from 'express';
import { db } from '../../config/db';

export const saveTelegramUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      res.status(400).json({ error: 'Missing Telegram user ID' });
      return;
    }
    const { rows } = await db.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [user.id]
    );
    if (rows.length) {
      res.json({ user: rows[0] });
      return;
    }
    const insertRes = await db.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.id, user.username, user.first_name, user.last_name, user.photo_url]
    );
    res.json({ user: insertRes.rows[0] });
  } catch (err) {
    console.error('Telegram user save failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      res.status(400).json({ error: 'Missing Telegram user ID' });
      return;
    }

    const { rows } = await db.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [user.id]
    );
    if (rows.length) {
      res.json(rows[0]);
      return;
    }
    const insertRes = await db.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        user.id,
        user.username || null,
        user.first_name || null,
        user.last_name || null,
        user.photo_url || null
      ]
    );
    res.json(insertRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
};
