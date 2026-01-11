import { Router } from "express";
import { validateBody, validateParams } from "../middleware/inputValidation";
import {
  createGratitudeSchema,
  updateGratitudeSchema,
  uuidSchema,
} from "../schemas/gratitudeSchema";
import {
  createGratitude,
  deleteGratitude,
  getAllGratitudes,
  getSingleGratitude,
  updateGratitude,
} from "../controllers/gratitudeController";
const gratitudesRouter = Router();

gratitudesRouter.get("/", getAllGratitudes);
gratitudesRouter.get("/:id", validateParams(uuidSchema), getSingleGratitude);
gratitudesRouter.post(
  "/",
  validateBody(createGratitudeSchema),
  createGratitude
);
gratitudesRouter.patch(
  "/:id",
  validateParams(uuidSchema),
  validateBody(updateGratitudeSchema),
  updateGratitude
);
gratitudesRouter.delete("/:id", validateParams(uuidSchema), deleteGratitude);

export default gratitudesRouter;
