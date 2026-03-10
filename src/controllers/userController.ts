import { Request, Response } from "express";
import * as userService from "../services/userService";

/* ================= REGISTER ================= */

export const register = async (req: Request, res: Response) => {
  try {

    const { name, email, password } = req.body;

    const user = await userService.register(
      name,
      email,
      password
    );

    res.status(201).json({
      message: "User registered",
      user
    });

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }
};


/* ================= LOGIN ================= */

export const login = async (req: Request, res: Response) => {

  try {

    const { email, password } = req.body;

    const { accessToken, refreshToken } =
      await userService.login(email, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful"
    });

  } catch (error: any) {

    res.status(401).json({
      message: error.message
    });

  }

};


/* ================= LOGOUT ================= */

export const logout = async (req: Request, res: Response) => {

  try {

    const refreshToken = req.cookies.refreshToken;

    await userService.logout(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully"
    });

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }

};
/* ================= REFRESH ================= */
export const refresh = async (req: Request, res: Response) => {

  try {

    const refreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } =
      await userService.refresh(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Token refreshed"
    });

  } catch (error: any) {

    res.status(401).json({
      message: error.message
    });

  }

};