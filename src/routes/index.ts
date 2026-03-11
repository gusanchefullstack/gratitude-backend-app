import { Router } from "express";
import gratitudesRouter from "./gratitudeRoutes.js";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import mantraRouter from "./mantraRoutes.js";
import dashboardRouter from "./dashboardRoutes.js";
import { authenticateToken } from "../middleware/auth.js";

const routerapiv1 = Router();

routerapiv1.use("/gratitudes", authenticateToken ,gratitudesRouter)
routerapiv1.use("/auth", authRouter)
routerapiv1.use("/users", authenticateToken, userRouter)
routerapiv1.use("/mantraoftheday", mantraRouter)
routerapiv1.use("/dashboard", authenticateToken, dashboardRouter)
export default routerapiv1;