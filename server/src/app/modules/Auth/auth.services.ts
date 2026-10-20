import { Request } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../../../utils/pg";
import { jwtHelpers } from "../../../app/helpers/jwt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(config.google_client_id);

const selectUser = `SELECT id, name, email, role, "isDeleted", "createdAt", "updatedAt" FROM users`;

const createUser = async (req: Request) => {
  const file = req.file as { path?: string } | undefined;
  const { password, role } = req.body;
  const { name, email, phone } = req.body.user;

  const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    email.toLowerCase(),
  ]);
  if (existingUser.rows.length) {
    throw new AppError(httpStatus.CONFLICT, "This email is already registered.");
  }

  const passwordHash = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds) || 12);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id, name, email, role`,
      [name, email.toLowerCase(), role],
    );
    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO user_auth_identities ("userId", provider, "passwordHash") VALUES ($1, 'LOCAL', $2)`,
      [user.id, passwordHash],
    );

    await client.query("COMMIT");

    const tokens = jwtHelpers.createUserTokens(user);
    return { user, ...tokens };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const result = await pool.query(
    `${selectUser} WHERE email = $1 AND "isDeleted" = false LIMIT 1`,
    [email.toLowerCase()],
  );
  const user = result.rows[0];

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const identity = await pool.query(
    `SELECT "passwordHash" FROM user_auth_identities WHERE "userId" = $1 AND provider = 'LOCAL' LIMIT 1`,
    [user.id],
  );

  const passwordHash = identity.rows[0]?.passwordHash;
  if (!passwordHash) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account uses Google sign-in. Please continue with Google.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, passwordHash);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect.");
  }

  const tokens = jwtHelpers.createUserTokens(user);
  return { user, ...tokens };
};

const refreshToken = async (token: string) => {
  let decoded: any;
  try {
    decoded = jwtHelpers.verifyToken(token, config.jwt_access_secret as string);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userResult = await pool.query(
    `${selectUser} WHERE id = $1 AND "isDeleted" = FALSE LIMIT 1`,
    [decoded.id],
  );
  const user = userResult.rows[0];
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const accessToken = jwtHelpers.createUserTokens(user).accessToken;
  return { accessToken };
};

const changePassword = async (
  user: { id?: string; email?: string },
  payload: { oldPassword: string; newPassword: string },
) => {
  const userId = user?.id;
  const userEmail = user?.email;

  const userData = await pool.query(
    `${selectUser} WHERE (id = $1 OR ($1 IS NULL AND email = $2)) AND "isDeleted" = FALSE LIMIT 1`,
    [userId || null, userEmail || null],
  );
  const existingUser = userData.rows[0];

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const identity = await pool.query(
    `SELECT "passwordHash" FROM user_auth_identities WHERE "userId" = $1 AND provider = 'LOCAL' LIMIT 1`,
    [existingUser.id],
  );

  const passwordHash = identity.rows[0]?.passwordHash;
  if (!passwordHash) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account uses Google sign-in. Password change is only available for local accounts.",
    );
  }

  const isCorrectPassword = await bcrypt.compare(payload.oldPassword, passwordHash);
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect!");
  }

  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password.",
    );
  }

  const isSameAsOldHash = await bcrypt.compare(payload.newPassword, passwordHash);
  if (isSameAsOldHash) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password.",
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE user_auth_identities SET "passwordHash" = $1 WHERE "userId" = $2 AND provider = 'LOCAL'`,
      [hashedPassword, existingUser.id],
    );

    await client.query(
      `UPDATE users SET "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1`,
      [existingUser.id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return { message: "Password changed successfully!" };
};

const getMe = async (user: { id?: string; email?: string }) => {
  const userId = user?.id;
  const userEmail = user?.email;

  const userResult = await pool.query(
    `${selectUser} WHERE (id = $1 OR ($1 IS NULL AND email = $2)) AND "isDeleted" = FALSE LIMIT 1`,
    [userId || null, userEmail || null],
  );
  const existingUser = userResult.rows[0];

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const identitiesResult = await pool.query(
    `SELECT provider, "providerUserId", ("passwordHash" IS NOT NULL) AS "hasPassword"
     FROM user_auth_identities
     WHERE "userId" = $1`,
    [existingUser.id],
  );

  const providers = identitiesResult.rows.map((row: any) => row.provider);
  const hasPassword = identitiesResult.rows.some(
    (row: any) => row.provider === "LOCAL" && row.hasPassword,
  );

  return {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    hasPassword,
    providers,
    createdAt: existingUser.createdAt,
    updatedAt: existingUser.updatedAt,
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await pool.query(
    `SELECT id, email FROM users WHERE email = $1 AND "isDeleted" = FALSE LIMIT 1`,
    [payload.email],
  );
  const user = userData.rows[0];

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const resetToken = jwtHelpers.signJwt(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.forget_pass_expire_in || "1h",
  );

  const resetLink = `${config.front_end_base_url || "http://localhost:3000"}/reset-password?userId=${user.id}&token=${resetToken}`;

  return { resetLink, userId: user.id };
};

const resetPassword = async (
  token: string,
  payload: { userId: string; password: string },
) => {
  const userData = await pool.query(
    `SELECT id FROM users WHERE id = $1 AND "isDeleted" = FALSE LIMIT 1`,
    [payload.userId],
  );
  const user = userData.rows[0];

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const isValidToken = jwtHelpers.verifyToken(token, config.jwt_access_secret as string);

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  const passwordHash = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds) || 12);

  await pool.query(
    `UPDATE user_auth_identities SET "passwordHash" = $1 WHERE "userId" = $2 AND provider = 'LOCAL'`,
    [passwordHash, payload.userId],
  );

  return { message: "Password reset successfully!" };
};

const authWithGoogle = async (payload: { credential: string }) => {
  const { credential } = payload;

  if (!config.google_client_id) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Google authentication is not configured on the server.",
    );
  }

  let ticket: any;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.google_client_id,
    });
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Google credential.");
  }

  const googlePayload = ticket.getPayload();
  const email = googlePayload?.email?.toLowerCase();
  const providerUserId = googlePayload?.sub;

  if (!email || !providerUserId || !googlePayload?.email_verified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Unable to verify Google account. Please try again.",
    );
  }

  const name =
    googlePayload.name ||
    [googlePayload.given_name, googlePayload.family_name]
      .filter(Boolean)
      .join(" ") ||
    email.split("@")[0];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let userResult = await client.query(
      `${selectUser} WHERE id = (
         SELECT "userId" FROM user_auth_identities
         WHERE provider = 'GOOGLE' AND "providerUserId" = $1 LIMIT 1
       )`,
      [providerUserId],
    );

    if (!userResult.rows.length) {
      const byEmail = await client.query(`${selectUser} WHERE email = $1 LIMIT 1`, [email]);
      if (byEmail.rows.length) {
        const existing = byEmail.rows[0];
        if (existing.isDeleted) {
          throw new AppError(httpStatus.FORBIDDEN, "This account has been deactivated.");
        }
        await client.query(
          `INSERT INTO user_auth_identities ("userId", provider, "providerUserId") VALUES ($1, 'GOOGLE', $2)
           ON CONFLICT (provider, "providerUserId") DO NOTHING`,
          [existing.id, providerUserId],
        );
        userResult = byEmail;
      }
    }

    if (!userResult.rows.length) {
      userResult = await client.query(
        `INSERT INTO users (name, email, role) VALUES ($1, $2, 'USER') RETURNING id, name, email, role`,
        [name, email],
      );
      const newUser = userResult.rows[0];
      await client.query(
        `INSERT INTO user_auth_identities ("userId", provider, "providerUserId") VALUES ($1, 'GOOGLE', $2)`,
        [newUser.id, providerUserId],
      );
    }

    await client.query("COMMIT");

    const user = userResult.rows[0];
    const tokens = jwtHelpers.createUserTokens(user);
    return { user, ...tokens };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const AuthServices = {
  createUser,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  authWithGoogle,
  getMe,
};