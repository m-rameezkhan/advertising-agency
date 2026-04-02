import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config();

export const env = {
  port: Number(process.env.AI_SERVICE_PORT || 4010),
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.LLM_MODEL || "gpt-4.1-mini",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
};
