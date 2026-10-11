import bcrypt from "bcrypt";
import config from "../../config/index.js";
import { ILoginUser, RegisterPayload } from "./auth.interface.js";
import { pool } from "../../utils/pg";
import { jwtUtils } from '../../utils/jwt';

const registerUserIntoDB = async (payload: RegisterPayload) => {
  const { name, email, password, phone, address, role } = payload;

  // 1. Check existing user
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const insertQuery = `
    INSERT INTO users (
      name,
      email,
      password,
      phone,
      address,
      role,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, email, phone, address, role, status
  `;

  const result = await pool.query(insertQuery, [
    name,
    email,
    hashedPassword,
    phone,
    address,
    role,
    "ACTIVE",
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
    throw new Error(
      "Your account has been suspended. Please contact support.",
    );
  }

  if (!user.password) {
    throw new Error(
      "Your account has been password problem. Please contact support.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password,
  );

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
};
