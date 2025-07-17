import type { Request, Response } from "express";
import { db } from "../../config/db";

export const saveTelegramUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(400).json({ error: "Missing Telegram user ID" });
    }

    const { rows } = await db.query(
      "SELECT * FROM users WHERE telegram_id = $1",
      [user.id]
    );

    if (rows.length > 0) {
      return res.json({ user: rows[0] });
    }

    const insertRes = await db.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        user.id,
        user.username || null,
        user.first_name || null,
        user.last_name || null,
        user.photo_url || null,
      ]
    );

    return res.json({ user: insertRes.rows[0] });
  } catch (err) {
    console.error("Telegram user save failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(400).json({ error: "Missing Telegram user ID" });
    }

    const { rows } = await db.query(
      "SELECT * FROM users WHERE telegram_id = $1",
      [user.id]
    );

    if (rows.length > 0) {
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
        user.photo_url || null,
      ]
    );

    return res.json(insertRes.rows[0]);
  } catch (err) {
    console.error("GetMe failed:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};
