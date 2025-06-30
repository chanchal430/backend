// export const savePrivyUser = async (req: any, res: any) => {
//   try {
//     const uid = (req as any).user?.userId;
//     if (!uid) {
//       return res.status(400).json({ error: 'Missing authenticated user ID (DID)' });
//     }

//     const { rows } = await db.query(
//       'SELECT * FROM users WHERE privy_uid = $1',
//       [uid]
//     );

//     if (rows.length) {
//       return res.json({ user: rows[0] });
//     }

//     const insertRes = await db.query(
//       `INSERT INTO users (privy_uid) VALUES ($1) RETURNING *`,
//       [uid]
//     );
//     const newUser = insertRes.rows[0];

//     return res.json({ user: newUser });
//   } catch (err: any) {
//     console.error('Privy user save failed:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

import { Request, Response } from 'express';
import { db } from '../../config/db';

export const saveTelegramUser = async (req: any, res: any) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(400).json({ error: 'Missing Telegram user ID' });
    }
    const { rows } = await db.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [user.id]
    );
    if (rows.length) {
      return res.json({ user: rows[0] });
    }
    const insertRes = await db.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.id, user.username, user.first_name, user.last_name, user.photo_url]
    );
    return res.json({ user: insertRes.rows[0] });
  } catch (err: any) {
    console.error('Telegram user save failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const getMe = async (req: any, res: any) => {
  try {
    const user = req.user;
    if (!user?.id) return res.status(400).json({ error: 'Missing Telegram user ID' });

    const { rows } = await db.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [user.id]
    );
    if (rows.length) {
      return res.json(rows[0]);
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
    return res.json(insertRes.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
};
