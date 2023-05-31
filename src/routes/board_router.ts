import { Router } from "express";
import { BoardController } from "../controllers/board_controller";

const BoardRouter = Router();

const controller = new BoardController();

BoardRouter.get("/", async (req, res) => {
  const data = await controller.fetchAll(req)
  res.status(200).json(data);
});

BoardRouter.put("/", async (req, res) => {
  const data = await controller.update(req)
  res.status(200).json(data);
});



export default BoardRouter;
