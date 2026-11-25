import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type UserRole = "user" | "seller" | "admin";
export type AuthTokenPayload = { sub: string; email: string; role: UserRole };

export function signAccessToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
