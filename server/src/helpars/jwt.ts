import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import config from "../config";

const signJwt = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const createUserTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = signJwt(
    { id: user.id, email: user.email, role: user.role },
    config.jwt_access_secret as string,
    (config.jwt_access_expire_in || "90d") as SignOptions["expiresIn"],
  );

  return { accessToken };
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  signJwt,
  createUserTokens,
  verifyToken,
};
