import { Request, Router } from "express";
import { CardTypeController } from "../controllers";

const controller = new CardTypeController()
const cardTypeRouter = Router();

cardTypeRouter.get("/", async (req: Request, res) => {
    const data = await controller.fetchAll(req)
    res.status(200).json(data);
});

export default cardTypeRouter 