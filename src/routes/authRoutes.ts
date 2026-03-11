import { Router } from "express";
import {
  registerNewUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../controllers/authController.js";
import { validateBody } from "../middleware/validation.js";
import { authLimiter, authSpeedLimiter } from "../middleware/rateLimit.js";
import {
  createUserBodySchema,
  userLoginSchema,
  refreshTokenBodySchema,
  logoutBodySchema,
} from "../schemas/user.schema.js";

const authRouter = Router();

authRouter.use(authSpeedLimiter, authLimiter);
authRouter.post("/register", validateBody(createUserBodySchema), registerNewUser)
authRouter.post("/login", validateBody(userLoginSchema) , loginUser)
authRouter.post("/refresh", validateBody(refreshTokenBodySchema), refreshUserToken)
authRouter.post("/logout", validateBody(logoutBodySchema), logoutUser)

export default authRouter;