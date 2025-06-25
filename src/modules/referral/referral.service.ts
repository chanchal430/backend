import { db } from '../../config/db';

export async function claimReferral(userId: number, code: string) {
  // Find the user by referral code
  const { rows } = await db.query('SELECT id FROM users WHERE referral_code = $1', [code]);
  if (!rows[0]) throw new Error('Invalid code');
  const referredById = rows[0].id;

  // Update user's referred_by_id
  await db.query('UPDATE users SET referred_by_id = $1 WHERE id = $2', [referredById, userId]);
  // Reward both users
  await db.query('UPDATE users SET points = points + 100 WHERE id = $1 OR id = $2', [userId, referredById]);
  return 100;
}
