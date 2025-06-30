import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../../config/db';

export const telegramLogin = async (req: any, res: any) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ error: 'Missing initData' });
    }

    const params = new URLSearchParams(initData);
    const receivedHash = params.get('hash');
    params.delete('hash');
    params.delete('signature');

    const dataCheckArray = Array.from(params.entries())
      .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
      .sort((a, b) => a.localeCompare(b));
    const dataCheckString = dataCheckArray.join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // SKIP HASH CHECK IN DEVELOPMENT MODE
    if (!isDev && calculatedHash !== receivedHash) {
      return res.status(403).json({
        error: 'Invalid hash: Untrusted data',
        detail: {
          receivedHash,
          calculatedHash,
          dataCheckString
        }
      });
    }

    const userJson = params.get('user');
    if (!userJson) {
      return res.status(400).json({ error: 'User data missing' });
    }

    const telegramUser = JSON.parse(decodeURIComponent(userJson));

    let user;
    const { rows: existingUsers } = await db.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramUser.id]
    );

    if (existingUsers.length > 0) {
      const updateRes = await db.query(
        `UPDATE users SET first_name = $1, last_name = $2, username = $3 WHERE telegram_id = $4 RETURNING *`,
        [
          telegramUser.first_name,
          telegramUser.last_name,
          telegramUser.username,
          telegramUser.id
        ]
      );
      user = updateRes.rows[0];
    } else {
      const insertRes = await db.query(
        `INSERT INTO users (telegram_id, first_name, last_name, username)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [
          telegramUser.id,
          telegramUser.first_name,
          telegramUser.last_name,
          telegramUser.username
        ]
      );
      user = insertRes.rows[0];
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.json({ accessToken, user });

  } catch (err) {
    console.error('Telegram login failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

