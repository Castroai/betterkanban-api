import { Request, Response, Router } from "express";
import {
  BusinessController,
  CreateOneBusinessInterface,
} from "../controllers/business_controller";

const BusinessRouter = Router();
const controller = new BusinessController();

BusinessRouter.post(
  "/",
  async (req: Request<{}, {}, CreateOneBusinessInterface>, res: Response) => {
    try {
      const data = await controller.createOne({
        ...req.body,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
export default BusinessRouter;
