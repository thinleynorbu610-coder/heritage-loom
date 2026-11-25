import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { UserModel } from "../models/user.model";

export const userRouter = Router();
userRouter.get("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.auth!.sub).select("name email role createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
});
