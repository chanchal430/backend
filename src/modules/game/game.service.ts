import { db } from '../../config/db';

export async function recordTap(userId: number, tapCount: number) {
  await db.query('UPDATE users SET points = points + $1 WHERE id = $2', [tapCount, userId]);
  await db.query('INSERT INTO taps (user_id, count, earned) VALUES ($1, $2, $3)', [userId, tapCount, tapCount]);
  const { rows } = await db.query('SELECT points FROM users WHERE id = $1', [userId]);
  return rows[0]?.points ?? 0;
}