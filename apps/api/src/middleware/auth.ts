import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (payload.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}