import { Router } from "express";
import { BoardController } from "../controllers";

const BoardRouter = Router();
const controller = new BoardController();

BoardRouter.get("/", async (req, res) => {
  const data = await controller.fetchAll(req)
  res.status(200).json(data);
});

export default BoardRouter;
