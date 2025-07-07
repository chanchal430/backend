import { Request, Response } from 'express';
import { db } from '../../config/db';
import { doCheckin } from './checkin.service';

export async function checkin(req: Request, res: Response) {
  // const privyUserId = req.user?.userId;
  const userId = req.user?.userId;


  if (!userId) {
    res.status(401).json({ error: 'Privy user ID not found in request.' });
    return;
  }
  try {
    // Directly proceed with userId, no DB check needed
    const { streak, reward } = await doCheckin(userId);

    res.json({ streak, reward });
  } catch (err) {
    console.error('Checkin failed:', err);
    res.status(500).json({ error: 'Internal server error during checkin.' });
  }
}