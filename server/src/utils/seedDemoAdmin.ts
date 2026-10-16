import { pool } from "./pg";
import bcrypt from "bcryptjs";
import config from "../config";

const DEMO_ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL || "demo.admin@nagoriksheba.local";
const DEMO_ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "DemoAdmin@12345";
const DEMO_ADMIN_NAME = process.env.DEMO_ADMIN_NAME || "Demo Admin";

export async function seedDemoAdmin() {
  // Only seed in non-production environments
  if (config.NODE_ENV === "production") {
    return;
  }

  // Opt-in via env var (defaults to true in development)
  const shouldSeed = process.env.SEED_DEMO_ADMIN ?? "true";
  if (shouldSeed !== "true") {
    return;
  }

  const existing = await pool.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [
    DEMO_ADMIN_EMAIL,
  ]);
  if (existing.rows.length) {
    console.log(`[seed] Demo admin already exists: ${DEMO_ADMIN_EMAIL}`);
    return;
  }

  const passwordHash = await bcrypt.hash(
    DEMO_ADMIN_PASSWORD,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (name, email, role) VALUES ($1, $2, 'ADMIN') RETURNING id, name, email, role`,
      [DEMO_ADMIN_NAME, DEMO_ADMIN_EMAIL],
    );
    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO user_auth_identities ("userId", provider, "passwordHash") VALUES ($1, 'LOCAL', $2)`,
      [user.id, passwordHash],
    );

    await client.query("COMMIT");

    console.log("==============================================");
    console.log("[seed] Demo admin account created for development:");
    console.log(`  Email:    ${DEMO_ADMIN_EMAIL}`);
    console.log(`  Password: ${DEMO_ADMIN_PASSWORD}`);
    console.log(`  Role:     ADMIN`);
    console.log("==============================================");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[seed] Failed to create demo admin:", error);
    throw error;
  } finally {
    client.release();
  }
}
