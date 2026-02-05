import { Router } from "express";
import gratitudesRouter from "./gratitudeRoutes.js";
import authRouter from "./authRoutes.js";

const routerapiv1 = Router();

routerapiv1.use("/gratitudes", gratitudesRouter)
routerapiv1.use("/auth", authRouter)
export default routerapiv1;