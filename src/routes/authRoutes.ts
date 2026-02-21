import { Router } from "express";
import { registerNewUser, loginUser } from "../controllers/authController.js";
import { validateBody } from "../middleware/validation.js";
import { createUserBodySchema, userLoginSchema } from "../schemas/user.schema.js";

const authRouter = Router();

authRouter.post("/register", validateBody(createUserBodySchema), registerNewUser)
authRouter.post("/login", validateBody(userLoginSchema) , loginUser)

export default authRouter;