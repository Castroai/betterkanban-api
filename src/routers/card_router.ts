import { Request, Router } from "express";
import { CardController } from "../controllers";

const controller = new CardController()
const CardRouter = Router();

CardRouter.put("/", async (req: Request, res) => {
    const data = await controller.update(req)
    res.status(200).json(data);
});
CardRouter.get("/", async (req: Request, res) => {
    const data = await controller.getOne(req)
    res.status(200).json(data);
});

CardRouter.post("/", async (req: Request, res) => {
    const data = await controller.create(req)
    res.status(200).json(data);
});

export default CardRouter 