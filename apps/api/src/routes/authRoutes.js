import { Router } from "express";
import { login, signup } from "../controllers/authController.js";

export function authRoutes() {
  const router = Router();
  router.post("/signup", signup);
  router.post("/login", login);
  return router;
}
