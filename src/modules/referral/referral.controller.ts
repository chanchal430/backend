import { Request, Response } from 'express';
import { db } from '../../config/db';

export async function claimReferral(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { code } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Find referred user by code
    const { rows } = await db.query('SELECT id FROM users WHERE referral_code = $1', [code]);
    if (!rows[0]) {
      res.status(404).json({ error: 'Invalid code' });
      return;
    }
    const referredById = rows[0].id;

    // Update current user
    await db.query('UPDATE users SET referred_by_id = $1 WHERE id = $2', [referredById, userId]);
    // Reward both users
    await db.query('UPDATE users SET points = points + 100 WHERE id = $1 OR id = $2', [userId, referredById]);
    res.json({ reward: 100 });
  } catch (err) {
    console.error('Referral claim failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
