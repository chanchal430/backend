import { Request, Response } from 'express';
import { db } from '../../config/db';


export const savePrivyUser = async (req: any, res: any) => {
  try {
    const uid = (req as any).user?.userId;
    if (!uid) {
      return res.status(400).json({ error: 'Missing authenticated user ID (DID)' });
    }

    const { rows } = await db.query(
      'SELECT * FROM users WHERE privy_uid = $1',
      [uid]
    );

    if (rows.length) {
      return res.json({ user: rows[0] });
    }

    const insertRes = await db.query(
      `INSERT INTO users (privy_uid) VALUES ($1) RETURNING *`,
      [uid]
    );
    const newUser = insertRes.rows[0];

    return res.json({ user: newUser });
  } catch (err: any) {
    console.error('Privy user save failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: any, res: any) => {
  try {
    const uid = req.user?.userId;
    if (!uid) return res.status(400).json({ error: 'Missing user ID' });

    const { rows } = await db.query(
      'SELECT * FROM users WHERE privy_uid = $1',
      [uid]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    return res.json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
};