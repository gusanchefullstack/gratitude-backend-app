import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { hashPasswords } from "../utils/passwords";
import { registerUser } from "../services/authServices";

export const registerNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;
    const hashedPassword = await hashPasswords(password);
    const newUser = await registerUser({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    const token = await generateToken({
      id: newUser.id,
      email: newUser.username,
      username: newUser.username,
    });
    return res.status(201).json({
      message: "User created",
      user: newUser,
      token,
    });
  } catch (error) {
    /*     console.log("Registration error...");
        res.status(500).json({ error: "Failed to create user." }); */
      next(error)
  }
};
