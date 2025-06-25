import { Request, Response } from "express";
import { db } from "../../config/db";

export async function tap(req: any, res: any) {
  try {
    console.log("🏷️ tap req.user:", req.user);
    const claims = req.user;

    let userId: number;

    // ── 1) Privy flow: userId comes back as a DID string
    if (typeof claims.userId === "string") {
      const { rows } = await db.query(
        "SELECT id FROM users WHERE privy_uid = $1",
        [claims.userId]
      );
      if (!rows[0]) {
        return res.status(404).json({ error: "User not found (privy_uid)" });
      }
      userId = rows[0].id;

    // ── 2) Telegram flow: userId signed into your JWT is a number
    } else if (typeof claims.userId === "number") {
      userId = claims.userId;

    // ── 3) Fallback: nothing matched
    } else {
      return res.status(401).json({ error: "Could not derive userId" });
    }

    // ── 2) Validate the tapCount
    const { tapCount } = req.body;
    if (typeof tapCount !== "number" || tapCount <= 0) {
      return res.status(400).json({ error: "Invalid tapCount" });
    }

    // ── 3) Update & log
    await db.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [tapCount, userId]
    );
    await db.query(
      "INSERT INTO taps (user_id, count, earned) VALUES ($1, $2, $3)",
      [userId, tapCount, tapCount]
    );

    // ── 4) Return new balance
    const { rows: result } = await db.query(
      "SELECT points FROM users WHERE id = $1",
      [userId]
    );
    return res.json({ newBalance: result[0].points });

  } catch (err: any) {
    console.error("❌ Tap error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
