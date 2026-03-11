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
  gratitudeListQuerySchema,
} from "../schemas/gratitude.schema.js";
import { validateParams, validateBody, validateQuery } from "../middleware/validation.js";


const gratitudesRouter = Router();
gratitudesRouter.get("/", validateQuery(gratitudeListQuerySchema), getAllGratitudes);
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
