import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type AuthTokenPayload, type UserRole } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request { auth?: AuthTokenPayload }
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) return res.status(403).json({ message: "Insufficient permissions" });
    return next();
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
