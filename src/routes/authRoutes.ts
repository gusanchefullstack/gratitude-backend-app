import { Router } from "express";
import { registerNewUser, loginUser } from "../controllers/authController";
import { validateBody } from "../middleware/validation";
import { createUserBodySchema, userLoginSchema } from "../schemas/user.schema";

const authRouter = Router();

authRouter.post("/register", validateBody(createUserBodySchema), registerNewUser)
authRouter.post("/login", validateBody(userLoginSchema) , loginUser)

export default authRouter;