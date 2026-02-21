import { Router } from "express";
import {
  createGratitude,
  getAllGratitudes,
  getSingleGratitude,
  updateGratitude,
  deleteGratitude,
} from "../controllers/gratitudeController.js";
import {
  createGratitudeBodySchema,
  updateGratitudeBodySchema,
  gratitudeParamsSchema,
} from "../schemas/gratitude.schema.js";
import { validateParams, validateBody } from "../middleware/validation.js";


const gratitudesRouter = Router();
gratitudesRouter.get("/", getAllGratitudes);
gratitudesRouter.get(
  "/:id",
  validateParams(gratitudeParamsSchema),
  getSingleGratitude,
);
gratitudesRouter.post(
  "/",
  validateBody(createGratitudeBodySchema),
  createGratitude,
);
gratitudesRouter.patch(
  "/:id",
  validateParams(gratitudeParamsSchema),
  validateBody(updateGratitudeBodySchema),
  updateGratitude,
);
gratitudesRouter.delete(
  "/:id",
  validateParams(gratitudeParamsSchema),
  deleteGratitude,
);

export default gratitudesRouter;
