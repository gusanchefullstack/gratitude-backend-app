import bcrypt from "bcrypt";

export const hashPasswords = async (password:string) => {
    return bcrypt.hash(password, process.env.BCRYPT_ROUNDS || 12 )
}