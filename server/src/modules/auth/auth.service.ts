import bcrypt from "bcrypt";
import config from "../../config/index.js";
import { ILoginUser, RegisterPayload } from "./auth.interface.js";
import { pool } from "../../utils/pg";
import { jwtUtils } from "../../utils/jwt";

<<<<<<< HEAD
const registerUserIntoDB = async (payload: RegisterPayload) => {
  const { name, email, role, authProviderId } = payload;

  // 1. Check existing user
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  const insertQuery = `
    INSERT INTO users (
      name,
      email,
      role,
      "authProviderId"
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await pool.query(insertQuery, [
    name,
    email,
    role,
    authProviderId,
  ]);

  const createdUser = result.rows[0];

  return createdUser;
};

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const result = await pool.query(
    `SELECT id, name, email, password, role, status
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (user.status === "SUSPENDED") {
    throw new Error("Your account has been suspended. Please contact support.");
  }

  if (!user.password) {
    throw new Error(
      "Your account has been password problem. Please contact support.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expire_in,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expirres_in,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  registerUserIntoDB,
  loginUser,
=======
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import httpStatus from "http-status";
import config from "../../config";
import { jwtHelpers } from "../../helpars/jwt";
import ApiError from "../../helpars/ApiError";
import { pool } from "../../utils/pg";

const googleClient = new OAuth2Client(config.google_client_id);

const selectUser = `SELECT id, name, email, role, "isDeleted", "createdAt", "updatedAt" FROM users`;

const createUserIntoDB = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = payload;

  const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    email.toLowerCase(),
  ]);
  if (existingUser.rows.length) {
    throw new ApiError(httpStatus.CONFLICT, "This email is already registered.");
  }

  const passwordHash = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, role`,
      [name, email.toLowerCase()],
    );
    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO user_auth_identities ("userId", provider, "passwordHash")
       VALUES ($1, 'LOCAL', $2)`,
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

const LoginUserIntoDB = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const result = await pool.query(
    `${selectUser} WHERE email = $1 AND "isDeleted" = false LIMIT 1`,
    [email.toLowerCase()],
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const identity = await pool.query(
    `SELECT "passwordHash" FROM user_auth_identities
     WHERE "userId" = $1 AND provider = 'LOCAL' LIMIT 1`,
    [user.id],
  );

  const passwordHash = identity.rows[0]?.passwordHash;
  if (!passwordHash) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This account uses Google sign-in. Please continue with Google.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, passwordHash);
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect.");
  }

  const tokens = jwtHelpers.createUserTokens(user);
  return { user, ...tokens };
};


const authWithGoogleIntoDB = async (payload: { credential: string }) => {
  const { credential } = payload;

  if (!config.google_client_id) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Google authentication is not configured on the server.",
    );
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.google_client_id,
    });
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Google credential.");
  }

  const googlePayload = ticket.getPayload();
  const email = googlePayload?.email?.toLowerCase();
  const providerUserId = googlePayload?.sub;

  if (!email || !providerUserId || !googlePayload?.email_verified) {
    throw new ApiError(
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

    // 1. Existing Google identity?
    let userResult = await client.query(
      `${selectUser} WHERE id = (
         SELECT "userId" FROM user_auth_identities
         WHERE provider = 'GOOGLE' AND "providerUserId" = $1 LIMIT 1
       )`,
      [providerUserId],
    );

    // 2. Existing local user with same email -> link Google identity.
    if (!userResult.rows.length) {
      const byEmail = await client.query(`${selectUser} WHERE email = $1 LIMIT 1`, [
        email,
      ]);
      if (byEmail.rows.length) {
        const existing = byEmail.rows[0];
        if (existing.isDeleted) {
          throw new ApiError(httpStatus.FORBIDDEN, "This account has been deactivated.");
        }
        await client.query(
          `INSERT INTO user_auth_identities ("userId", provider, "providerUserId")
           VALUES ($1, 'GOOGLE', $2)
           ON CONFLICT (provider, "providerUserId") DO NOTHING`,
          [existing.id, providerUserId],
        );
        userResult = byEmail;
      }
    }

    // 3. Brand new user -> create user + Google identity.
    if (!userResult.rows.length) {
      userResult = await client.query(
        `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, role`,
        [name, email],
      );
      const newUser = userResult.rows[0];
      await client.query(
        `INSERT INTO user_auth_identities ("userId", provider, "providerUserId")
         VALUES ($1, 'GOOGLE', $2)`,
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

const getMeFromDB = async (userId: string) => {
  const result = await pool.query(`${selectUser} WHERE id = $1 LIMIT 1`, [userId]);
  const user = result.rows[0];
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }
  return user;
};

export const AuthServices = {
  createUserIntoDB,
  LoginUserIntoDB,
  authWithGoogleIntoDB,
  getMeFromDB,
>>>>>>> 0b4e698bbfd63faf60bbc38a9a028642f805bbf9
};
