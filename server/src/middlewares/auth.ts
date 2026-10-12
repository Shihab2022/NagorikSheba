import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";
import { jwtHelpers } from "../helpars/jwt";
import ApiError from "../helpars/ApiError";
import { pool } from "../utils/pg";

const auth = (...roles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : (req.cookies?.accessToken as string | undefined);

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verified = jwtHelpers.verifyToken(token, config.jwt_access_secret as string);

      const result = await pool.query(
        `SELECT id, name, email, role FROM users WHERE id = $1 AND "isDeleted" = FALSE LIMIT 1`,
        [verified.id],
      );
      const user = result.rows[0];
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      (req as any).user = user;

      if (roles.length && !roles.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
