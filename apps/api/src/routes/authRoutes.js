import { Router } from "express";
import { login } from "../controllers/authController.js";

export function authRoutes() {
  const router = Router();
  router.post("/login", login);
  return router;
}
