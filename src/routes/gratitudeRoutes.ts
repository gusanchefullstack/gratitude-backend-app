import { Router } from "express";
import {
  createGratitude,
  getAllGratitudes,
  getSingleGratitude,
  updateGratitude,
  deleteGratitude,
} from "../controllers/gratitudeController";
import {
  createGratitudeBodySchema,
  gratitudeParamsSchema,
} from "../schemas/gratitude.schema";
import { validateParams, validateBody } from "../middleware/validation";

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
  validateBody(),
  updateGratitude,
);
gratitudesRouter.delete(
  "/:id",
  validateParams(gratitudeParamsSchema),
  deleteGratitude,
);

export default gratitudesRouter;
