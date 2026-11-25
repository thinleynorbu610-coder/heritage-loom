import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./db/mongoose";

async function start() {
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`));
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
