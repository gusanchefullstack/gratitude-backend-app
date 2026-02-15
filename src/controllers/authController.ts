import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { hashPasswords, comparePasswords } from "../utils/passwords";
import { registerUser, login } from "../services/authServices";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const data = await login({ username, password });
    if (!data) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(201).json({
      message: "Login success",
      user: data.validatedUser,
      token: data.token
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
    const { email, username, password, firstName, lastName } = req.body;
    const data = await registerUser(req.body);

    return res.status(201).json({
      message: "User created",
      user: data.newUser,
      token: data.token
    });
  } catch (error) {
    /*     console.log("Registration error...");
        res.status(500).json({ error: "Failed to create user." }); */
    next(error);
  }
};
