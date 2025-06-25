import { Request, Response, NextFunction } from 'express';
import { privy } from '../utils/privy';

export async function requirePrivyAuth(req: any, res: any, next: any) {
  try {
    const bearer = req.headers.authorization;
    const token  = bearer?.startsWith('Bearer ')
                  ? bearer.slice(7)
                  : req.cookies['privy-token'];

    if (!token) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    const claims = await privy.verifyAuthToken(token);

     console.log('Privy Claims:', claims);
    (req as any).user = claims;
    next();
  } catch (err: any) {
    console.error('Privy token verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired access token' });
  }
}