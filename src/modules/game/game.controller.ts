import { Request, Response } from "express";
import { db } from "../../config/db";

export async function tap(req: any, res: any) {
  try {
    console.log("🏷️ tap req.user:", req.user);

    const rawUserId = req.user?.userId;
    const userId = Number(rawUserId);

    if (!userId || isNaN(userId)) {
      return res.status(401).json({ error: "Unauthorized or invalid userId" });
    }
    // Validate tapCount
    const { tapCount } = req.body;
    if (typeof tapCount !== "number" || tapCount <= 0) {
      return res.status(400).json({ error: "Invalid tapCount" });
    }

    // Update user points and log tap
    await db.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [tapCount, userId]
    );
    await db.query(
      "INSERT INTO taps (user_id, count, earned) VALUES ($1, $2, $3)",
      [userId, tapCount, tapCount]
    );

    // Return updated balance
    const { rows } = await db.query(
      "SELECT points FROM users WHERE id = $1",
      [userId]
    );

    return res.json({ newBalance: rows[0].points });

  } catch (err: any) {
    console.error("❌ Tap error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
