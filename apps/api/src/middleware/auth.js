import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";

export function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(httpError(401, "Missing bearer token"));
  }

  try {
    req.user = jwt.verify(header.replace("Bearer ", ""), env.jwtSecret);
    return next();
  } catch {
    return next(httpError(401, "Invalid or expired token"));
  }
}
