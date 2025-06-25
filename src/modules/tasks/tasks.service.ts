import { db } from '../../config/db';

// Fetch all social tasks (optionally filter by status/user)
export async function getAllTasks() {
  const { rows } = await db.query('SELECT * FROM social_tasks');
  return rows;
}

// Mark a task complete, reward user
export async function completeTask(userId: number, taskId: number, proof: object) {
  await db.query(
    'INSERT INTO social_task_completions (task_id, user_id, proof) VALUES ($1, $2, $3)',
    [taskId, userId, proof]
  );
  // Get task reward and update user points
  const { rows } = await db.query('SELECT reward FROM social_tasks WHERE id = $1', [taskId]);
  const reward = rows[0]?.reward ?? 0;
  await db.query('UPDATE users SET points = points + $1 WHERE id = $2', [reward, userId]);
  return reward;
}
