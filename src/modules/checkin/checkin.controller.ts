import { Request, Response } from 'express';
import { db } from '../../config/db';
import { doCheckin } from './checkin.service';

export async function checkin(req: any, res: any) {
  const privyUserId = req.user?.userId;

  if (!privyUserId) {
    return res.status(401).json({ error: 'Privy user ID not found in request.' });
  }

  try {
    // 1. Find the user's internal 'id' (bigint) from the 'users' table
    //    using their 'privy_uid' (Privy DID).
    const { rows: userRows } = await db.query(
      'SELECT id FROM users WHERE privy_uid = $1',
      [privyUserId]
    );

    const user = userRows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found in database for the given Privy ID.' });
    }

    const internalUserId = user.id; // This is the bigint 'id'

    // 2. Now use the internalUserId for all checkin and user updates
    //    It's better to call your service function here
    const { streak, reward } = await doCheckin(internalUserId);

    res.json({ streak, reward });

  } catch (err: any) {
    console.error('Checkin failed:', err);
    res.status(500).json({ error: 'Internal server error during checkin.' });
  }
}