import { db } from "../db/db";
import { users, refreshTokens } from "../db/schema";
import { eq } from "drizzle-orm";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/* ================= REGISTER ================= */

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword
    })
    .returning();

  return newUser[0];
};

export const getUserById = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id)
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};

/* ================= LOGIN ================= */

export const login = async (
  email: string,
  password: string
) => {

  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  /* create access token */

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  /* create refresh token */

  const refreshToken = crypto.randomUUID();

  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};

/* ================= LOGOUT ================= */

export const logout = async (refreshToken: string) => {

  if (!refreshToken) return;

  await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken));

};
/* ================= REFRESH ================= */
export const refresh = async (refreshToken: string) => {

  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  const tokenRecord = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.token, refreshToken)
  });

  if (!tokenRecord) {
    throw new Error("Invalid refresh token");
  }

  if (tokenRecord.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  /* generate new access token */

  const newAccessToken = jwt.sign(
    { userId: tokenRecord.userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  /* generate new refresh token */

  const newRefreshToken = crypto.randomUUID();

  /* delete old refresh token */

  await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken));

  /* insert new refresh token */

  await db.insert(refreshTokens).values({
    userId: tokenRecord.userId,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};
