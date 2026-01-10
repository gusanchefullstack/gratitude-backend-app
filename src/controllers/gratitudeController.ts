import { Request, Response, NextFunction } from "express";

export const getAllGratitudes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json({ message: "Get All" })
    } catch (error) {
        next(error)
    }
};
export const getSingleGratitude = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        return res.json({ message: `Get one: ${id}`})
    } catch (error) {
        next(error)
    }
};
export const createGratitude = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        return res.json({ message: `Create one`, data})
    } catch (error) {
        next(error)
    }
};
export const updateGratitude = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;
        return res.json({ message: `Update one: ${id}`, data})
    } catch (error) {
        next(error)
    }
};
export const deleteGratitude = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        return res.json({ message: `Delete: ${id}`})
    } catch (error) {
        next(error)
    }
};