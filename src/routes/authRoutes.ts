import { Router } from "express";
import { registerNewUser } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/register", registerNewUser)

export default authRouter;