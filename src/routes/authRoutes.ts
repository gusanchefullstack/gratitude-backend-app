import { Router } from "express";
import { registerNewUser } from "../controllers/authController";
import { validateBody } from "../middleware/validation";
import { createUserBodySchema } from "../schemas/user.schema";

const authRouter = Router();

authRouter.post("/register", validateBody(createUserBodySchema), registerNewUser)

export default authRouter;