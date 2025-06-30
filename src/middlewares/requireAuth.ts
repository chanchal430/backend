// import { validate, parse } from '@telegram-apps/init-data-node';

// export const requireTelegramAuth = (req: any, res: any, next: any) => {
//   const [authType, authData = ''] = (req.header('authorization') || '').split(' ');
//   const isDev = process.env.NODE_ENV === "development";

//   console.log('authType',authType)
//   console.log('authData',authData)


//   if (authType !== 'tma' || !authData) {
//     return res.status(401).json({ error: 'Unauthorized: No Telegram init data' });
//   }

//   const token = '8032331431:AAEfiuj-Ta6Iyiwnn58rH1yhDbrlAwrQKHM';

//   try {
//     let initData;
//     if (isDev) {
//       // Dev mode: just parse, don't validate signature/timestamp
//       initData = parse(authData);
//     } else {
//       // Production: full validation
//       validate(authData, token, { expiresIn: 3600 });
//       initData = parse(authData);
//     }
//     req.user = initData.user;
//     next();
//   } catch (e: any) {
//     return res.status(401).json({ error: 'Invalid Telegram auth', detail: e.message });
//   }
// };


import jwt from 'jsonwebtoken';

export const requireTelegramAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized: No bearer token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // decoded contains { userId }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};