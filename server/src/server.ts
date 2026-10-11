import { Server } from "http";
import app from "./app";
import config from "./config";
import { runMigrations } from "./utils/migrate";

async function main() {
  const port = config.port;
  if (process.env.NODE_ENV !== 'production') {
    await runMigrations();
  }
  const server: Server = app.listen(port, () => {
    console.log(`\x1b[32mSuccess! Server running   on port ${port}\x1b[0m`);
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
