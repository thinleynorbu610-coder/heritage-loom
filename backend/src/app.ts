import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import { roleRouter } from "./routes/role.routes";

export const app = express();
app.use(cors({ origin: env.FRONTEND_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/role-check", roleRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof Error && error.name === "ZodError") return res.status(400).json({ message: "Invalid request data" });
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
});
