import { db } from '../../config/db';

// Returns streak and reward
export async function doCheckin(userId: number) {
  // Count existing checkins in the last 24 hours for streak logic (simple version)
  const { rows } = await db.query(
    "SELECT COUNT(*) FROM checkins WHERE user_id = $1 AND created_at > NOW() - INTERVAL '1 day'",
    [userId]
  );
  const streak = Number(rows[0]?.count ?? 0) + 1;
  const reward = streak * 10;
  await db.query('INSERT INTO checkins (user_id, day, reward) VALUES ($1, $2, $3)', [userId, streak, reward]);
  await db.query('UPDATE users SET points = points + $1 WHERE id = $2', [reward, userId]);
  return { streak, reward };
}
