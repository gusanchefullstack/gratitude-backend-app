import { Router } from "express";
import { Request, Response, NextFunction } from "express";
const gratitudesRouter = Router();

gratitudesRouter.get("/", (req, res) => {
    res.json({ message: "Get All" })
})
gratitudesRouter.get("/:id", (req, res) => {
    res.json({ message: "Get One"})
})
gratitudesRouter.post("/", (req, res) => {
    res.json({ message: "Post"})
})
gratitudesRouter.patch("/:id", (req, res) => {
    res.json({ message: "Patch"})
})
gratitudesRouter.delete("/:id", (req, res) => {
    res.json({ message: "Delete"})
})
export default gratitudesRouter;
