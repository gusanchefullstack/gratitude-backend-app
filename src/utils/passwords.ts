import bcrypt from "bcrypt";
import { config } from "#config/env.js";

export const hashPasswords = async (password:string) => {
    return bcrypt.hash(password, config.BCRYPT_ROUNDS)
};

export const comparePasswords = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword)
}