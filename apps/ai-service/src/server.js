import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { requestId } from "./middleware/requestId.js";
import { generationRoutes } from "./routes/generationRoutes.js";

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use(requestId);
app.use(morgan(":method :url :status :response-time ms req=:req[x-request-id]"));
app.use("/generate", generationRoutes());

app.use((error, _req, res, _next) => {
  res.status(500).json({
    error: {
      message: error.message || "Unexpected AI service error"
    }
  });
});

app.listen(env.port, () => {
  console.log(`AI microservice listening on http://localhost:${env.port}`);
});
