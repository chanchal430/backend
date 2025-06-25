import { db } from '../../config/db';

export async function getUserById(id: number | string) {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

export async function getUserByTelegramId(telegramId: number | string) {
  const { rows } = await db.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
  return rows[0];
}
