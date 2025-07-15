// import { Request, Response, NextFunction } from 'express';
import express from "express";
import type { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
};
