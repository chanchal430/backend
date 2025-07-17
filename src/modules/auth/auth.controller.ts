import type { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";

// Helper to calculate Telegram WebApp hash
const calculateHash = (params: URLSearchParams, botToken: string): string => {
  const dataCheckArray = Array.from(params.entries())
    .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
    .sort((a, b) => a.localeCompare(b));

  const dataCheckString = dataCheckArray.join("\n");
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  return crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
};

export const telegramLogin = async (req: Request, res: Response) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const jwtSecret = process.env.JWT_SECRET;
  const isDev = process.env.NODE_ENV === "development";

  if (!botToken || !jwtSecret) {
    return res.status(500).json({ error: "Server configuration missing." });
  }

  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ error: "Missing initData." });
  }

  try {
    const params = new URLSearchParams(initData);
    const receivedHash = params.get("hash");
    params.delete("hash");
    params.delete("signature");

    const calculatedHash = calculateHash(params, botToken);

    if (!isDev && receivedHash !== calculatedHash) {
      return res.status(403).json({
        error: "Invalid hash: data can't be trusted.",
        receivedHash,
        calculatedHash,
      });
    }

    const userJson = params.get("user");
    if (!userJson) {
      return res.status(400).json({ error: "Missing user data." });
    }

    const telegramUser = JSON.parse(decodeURIComponent(userJson));
    const telegramId = telegramUser.id;

    // Try to find the user first
    const { rows: existingUsers } = await db.query(
      "SELECT * FROM users WHERE telegram_id = $1",
      [telegramId]
    );

    let user;
    if (existingUsers.length > 0) {
      // Update existing user
      const updateRes = await db.query(
        `UPDATE users
         SET first_name = $1, last_name = $2, username = $3
         WHERE telegram_id = $4
         RETURNING *`,
        [
          telegramUser.first_name ?? null,
          telegramUser.last_name ?? null,
          telegramUser.username ?? null,
          telegramId,
        ]
      );
      user = updateRes.rows[0];
    } else {
      // Insert new user
      const insertRes = await db.query(
        `INSERT INTO users (telegram_id, first_name, last_name, username)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          telegramId,
          telegramUser.first_name ?? null,
          telegramUser.last_name ?? null,
          telegramUser.username ?? null,
        ]
      );
      user = insertRes.rows[0];
    }

    // Create JWT token
    const accessToken = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "7d",
    });

    return res.json({ accessToken, user });
  } catch (err: any) {
    console.error("Telegram login error:", err);
    if (err.code === "23505") {
      return res.status(409).json({
        error: "User already exists with this Telegram ID.",
        detail: err.detail,
      });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};
