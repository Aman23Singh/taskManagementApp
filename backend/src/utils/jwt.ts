import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET ?? "";
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "";
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

export type TokenPayload = {
  userId: string;
  email: string;
};

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret) as JwtPayload & TokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret) as JwtPayload & TokenPayload;
