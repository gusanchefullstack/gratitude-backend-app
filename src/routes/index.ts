import { Router } from "express";

const routerapiv1 = Router();

routerapiv1.get("/gratitudes", (req, res) => res.send("Hello gratitude app"))
export default routerapiv1;