import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

export const roleRouter = Router();
roleRouter.get("/seller", requireAuth, requireRole("seller"), (_req, res) => res.json({ message: "Seller authentication successful" }));
roleRouter.get("/admin", requireAuth, requireRole("admin"), (_req, res) => res.json({ message: "Admin authentication successful" }));
