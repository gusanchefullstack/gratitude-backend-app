import { Router } from "express";
import {
  createGratitude,
  getAllGratitudes,
  getSingleGratitude,
  updateGratitude,
  deleteGratitude,
} from "../controllers/gratitudeController";

const gratitudesRouter = Router();
gratitudesRouter.get("/", getAllGratitudes);
gratitudesRouter.get("/:id", getSingleGratitude);
gratitudesRouter.post("/", createGratitude);
gratitudesRouter.patch("/:id", updateGratitude);
gratitudesRouter.delete("/:id", deleteGratitude);

export default gratitudesRouter;
