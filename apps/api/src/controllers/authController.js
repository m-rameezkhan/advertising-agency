import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";
import { authenticateUser, createUser } from "../services/authService.js";

function issueToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, env.jwtSecret, { expiresIn: "8h" });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw httpError(400, "email and password are required");
    }

    const user = await authenticateUser({ email, password });
    const token = issueToken(user);

    res.json({
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      throw httpError(400, "name, email, and password are required");
    }

    if (String(password).length < 8) {
      throw httpError(400, "Password must be at least 8 characters long");
    }

    const user = await createUser({ name: String(name).trim(), email: String(email).trim(), password: String(password) });
    const token = issueToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
}
