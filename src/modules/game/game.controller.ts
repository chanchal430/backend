import type { Request, Response } from "express";
import { db } from "../../config/db";

export async function tap(req: Request, res: Response) {
  try {
    console.log("🏷️ tap req.user:", req.user);

    const rawUserId = req.user?.userId;
    const userId = Number(rawUserId);

    if (!userId || isNaN(userId)) {
      res.status(401).json({ error: "Unauthorized or invalid userId" });
      return;
    }
    // Validate tapCount
    const { tapCount } = req.body;
    if (typeof tapCount !== "number" || tapCount <= 0) {
      res.status(400).json({ error: "Invalid tapCount" });
      return;
    }

    // Update user points and log tap
    await db.query("UPDATE users SET points = points + $1 WHERE id = $2", [
      tapCount,
      userId,
    ]);
    await db.query(
      "INSERT INTO taps (user_id, count, earned) VALUES ($1, $2, $3)",
      [userId, tapCount, tapCount]
    );

    // Return updated balance
    const { rows } = await db.query("SELECT points FROM users WHERE id = $1", [
      userId,
    ]);

    res.json({ newBalance: rows[0].points });
  } catch (err) {
    console.error("❌ Tap error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
