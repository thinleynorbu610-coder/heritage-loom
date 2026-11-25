import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserModel } from "../models/user.model";
import { signAccessToken } from "../utils/jwt";

const credentialsSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

function publicUser(user: { _id: unknown; name: string; email: string; role: "user" | "seller" | "admin" }) {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}

export async function register(req: Request, res: Response) {
  const input = credentialsSchema.extend({ name: z.string().trim().min(2).max(100) }).parse(req.body);
  const existing = await UserModel.exists({ email: input.email });
  if (existing) return res.status(409).json({ message: "An account with this email already exists" });

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await UserModel.create({ name: input.name, email: input.email, passwordHash, role: "user" });
  const token = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  return res.status(201).json({ user: publicUser(user), token });
}

export async function login(req: Request, res: Response) {
  const input = credentialsSchema.omit({ name: true }).parse(req.body);
  const user = await UserModel.findOne({ email: input.email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  return res.json({ user: publicUser(user), token });
}
