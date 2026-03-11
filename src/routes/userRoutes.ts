import { Router } from "express";
import {
  getMyProfile,
  updateMyPassword,
  updateMyProfile,
} from "../controllers/userController.js";
import { validateBody } from "../middleware/validation.js";
import {
  changePasswordBodySchema,
  updateMyProfileBodySchema,
} from "../schemas/user.schema.js";

const userRouter = Router();

userRouter.get("/me", getMyProfile);
userRouter.patch("/me", validateBody(updateMyProfileBodySchema), updateMyProfile);
userRouter.patch(
  "/me/password",
  validateBody(changePasswordBodySchema),
  updateMyPassword,
);

export default userRouter;
