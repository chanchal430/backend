// import crypto from 'crypto';

// export function validateTelegramAuth(data: any): boolean {
//   const { hash, ...fields } = data;
//   const secret = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN!).digest();
//   const checkString = Object.keys(fields)
//     .sort()
//     .map(k => `${k}=${fields[k]}`)
//     .join('\n');
//   const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
//   return hmac === hash;
// }
