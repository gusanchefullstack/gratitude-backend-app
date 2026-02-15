import { Router } from "express";
import gratitudesRouter from "./gratitudeRoutes.js";
import authRouter from "./authRoutes.js";
import { authenticateToken } from "../middleware/auth.js";

const routerapiv1 = Router();

routerapiv1.use("/gratitudes", authenticateToken ,gratitudesRouter)
routerapiv1.use("/auth", authRouter)
export default routerapiv1;