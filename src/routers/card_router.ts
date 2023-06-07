import { Request, Router } from "express";
import { CardController } from "../controllers";

const controller = new CardController()
const CardRouter = Router();

CardRouter.put("/", async (req: Request, res) => {
    const data = await controller.update(req)
    res.status(200).json(data);
});
CardRouter.put("/:id", async (req: Request, res) => {
    const data = await controller.updateDetails(Number(req.params.id), req)
    res.status(200).json(data);
});
CardRouter.delete("/:id", async (req: Request, res) => {
    const data = await controller.deleteOne(Number(req.params.id))
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