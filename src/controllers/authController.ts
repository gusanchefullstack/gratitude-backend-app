import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwt";
import { hashPasswords } from "../utils/passwords";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, username, password, firstName, lastName } = req.body;
        const hashedPassword = await hashPasswords(password)
        
    } catch (error) {
        console.log("Registration error...")
        res.status(500).json({error: "Failed to create user."})
    }
}