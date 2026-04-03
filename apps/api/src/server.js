import http from "http";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { pool } from "./db/pool.js";
import { getAlertHistory } from "./services/alertService.js";

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: env.clientOrigin
  }
});

const app = createApp(io);
httpServer.on("request", app);

io.on("connection", async (socket) => {
  try {
    const history = await getAlertHistory();
    socket.emit("alerts:history", history);
  } catch (error) {
    console.error("Unable to load alert history. Postgres may not be available yet.", error.message);
    socket.emit("alerts:history", []);
  }
});

httpServer.listen(env.port, () => {
  console.log(`Campaign API listening on http://localhost:${env.port}`);
  console.log("DB URL:", process.env.DATABASE_URL);
});

pool
  .query("SELECT 1")
  .then(() => {
    console.log("Postgres connection established.");
  })
  .catch((error) => {
    console.error("Postgres connection failed. Start the database before using campaign endpoints.", error.message);
  });
