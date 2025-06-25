import { Request, RequestHandler, Response } from 'express';


export const requireAdmin: RequestHandler = (req: any, res: any, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};
