import { Router } from "express";
import {
  createGratitude,
  deleteGratitude,
  getAllGratitudes,
  getSingleGratitude,
  updateGratitude,
} from "#controllers/gratitudeController.js";
const gratitudesRouter = Router();

gratitudesRouter.get("/", getAllGratitudes);
gratitudesRouter.get("/:id", getSingleGratitude);
gratitudesRouter.post("/", createGratitude);
gratitudesRouter.patch("/:id", updateGratitude);
gratitudesRouter.delete("/:id", deleteGratitude);

export default gratitudesRouter;
