import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";

let seededHash;

async function getPasswordHash() {
  if (!seededHash) {
    seededHash = await bcrypt.hash(env.appUserPassword, 10);
  }
  return seededHash;
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw httpError(400, "email and password are required");
    }

    const hash = await getPasswordHash();
    const matches = email === env.appUserEmail && (await bcrypt.compare(password, hash));

    if (!matches) {
      throw httpError(401, "Invalid credentials");
    }

    const token = jwt.sign({ email, role: "account-manager" }, env.jwtSecret, { expiresIn: "8h" });

    res.json({
      token,
      user: {
        email,
        role: "account-manager"
      }
    });
  } catch (error) {
    next(error);
  }
}
