import http from "http";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
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
  const history = await getAlertHistory();
  socket.emit("alerts:history", history);
});

httpServer.listen(env.port, () => {
  console.log(`Campaign API listening on http://localhost:${env.port}`);
});
