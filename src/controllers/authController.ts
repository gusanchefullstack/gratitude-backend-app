import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  login,
  refreshAuthSession,
  logoutAuthSession,
} from "../services/authServices.js";
import { AuthenticationError } from "../utils/errors.js";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const data = await login({ username, password });
    if (!data) {
      throw new AuthenticationError("Invalid username or password");
    }

    return res.status(200).json({
      message: "Login success",
      user: data.validatedUser,
      token: data.accessToken,
      refreshToken: data.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const registerNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await registerUser(req.body);

    return res.status(201).json({
      message: "User created",
      user: data.newUser,
      token: data.accessToken,
      refreshToken: data.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken: refreshTokenValue } = req.body;
    const data = await refreshAuthSession(refreshTokenValue);

    return res.status(200).json({
      message: "Token refreshed",
      user: data.user,
      token: data.accessToken,
      refreshToken: data.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    await logoutAuthSession(refreshToken);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
