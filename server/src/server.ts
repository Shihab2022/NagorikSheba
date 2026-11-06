import { Server } from "http";
import app from "./app";
import config from "./config";
import { runMigrations } from "./utils/migrate";
import { setupAICheckpointer } from "./app/modules/AI/ai.graph";
import { seedDemoAdmin } from "./utils/seedDemoAdmin";
import { seedServices } from "./seed/services.seed";

async function main() {
  const port = config.port;
  if (config.NODE_ENV !== "production") {
    await runMigrations();
    await seedDemoAdmin();
    await seedServices();
  }

  await setupAICheckpointer();

  const server: Server = app.listen(port, () => {
    console.log(`\x1b[32mSuccess! Server running on port ${port}\x1b[0m`);
  });


  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
