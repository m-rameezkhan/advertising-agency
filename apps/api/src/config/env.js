import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config();

export const env = {
  port: Number(process.env.API_PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "replace-me",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  appUserEmail: process.env.APP_USER_EMAIL || "admin@agency.local",
  appUserPassword: process.env.APP_USER_PASSWORD || "ChangeMe123!"
};
