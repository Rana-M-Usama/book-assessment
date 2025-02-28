import app from "./app";
import { Server } from "http";

export function createServer(): Server {
  const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
  });

  server.on("error", (error: Error) => {
    console.error("Server error:", error);
    process.exit(1);
  });

  return server;
}

if (require.main === module) {
  createServer();
}
