import bcrypt from "bcryptjs";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";

let initialized = false;

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  };
}

export async function ensureAuthSchema() {
  if (initialized) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'account-manager',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const existingAdmin = await pool.query("SELECT id FROM app_users WHERE email = $1", [env.appUserEmail]);
  const passwordHash = await bcrypt.hash(env.appUserPassword, 10);

  if (!existingAdmin.rowCount) {
    await pool.query(
      `
        INSERT INTO app_users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
      `,
      [env.appUserName, env.appUserEmail, passwordHash, "admin"]
    );
  } else {
    await pool.query(
      `
        UPDATE app_users
        SET name = $2,
            password_hash = $3,
            role = 'admin',
            updated_at = NOW()
        WHERE email = $1
      `,
      [env.appUserEmail, env.appUserName, passwordHash]
    );
  }

  initialized = true;
}

export async function createUser({ name, email, password }) {
  await ensureAuthSchema();

  const existingUser = await pool.query("SELECT id FROM app_users WHERE email = $1", [email.toLowerCase()]);
  if (existingUser.rowCount) {
    throw httpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `
      INSERT INTO app_users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, role, created_at
    `,
    [name, email.toLowerCase(), passwordHash]
  );

  return mapUser(rows[0]);
}

export async function authenticateUser({ email, password }) {
  await ensureAuthSchema();

  const identifier = String(email).trim().toLowerCase();
  const { rows } = await pool.query("SELECT * FROM app_users WHERE LOWER(email) = $1 OR LOWER(name) = $1", [identifier]);
  const user = rows[0];

  if (!user) {
    throw httpError(401, "Invalid credentials");
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    const isSeededAdmin = user.email === env.appUserEmail && password === env.appUserPassword;

    if (!isSeededAdmin) {
      throw httpError(401, "Invalid credentials");
    }

    const passwordHash = await bcrypt.hash(env.appUserPassword, 10);
    await pool.query("UPDATE app_users SET password_hash = $2, updated_at = NOW() WHERE id = $1", [user.id, passwordHash]);
    return mapUser(user);
  }

  return mapUser(user);
}
