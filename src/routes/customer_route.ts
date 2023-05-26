import { Request, Response, Router } from "express";
import {
  CreateOneCustomerInterface,
  CustomerContoller,
  UpdateOneCustomerInterface,
} from "../controllers/customer_controller";
import Joi from "joi";

const CustomerRouter = Router();
const controller = new CustomerContoller();

CustomerRouter.post(
  "/",
  async (req: Request<{}, {}, CreateOneCustomerInterface>, res: Response) => {
    const createCustomerSchema = Joi.object<CreateOneCustomerInterface>({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      accountStatus: Joi.string().optional(),
      businessId: Joi.string().optional(),
      jobTitle: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      source: Joi.string().optional(),
    });
    const { error } = createCustomerSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      try {
        const data = await controller.createOne({
          ...req.body,
        });
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  }
);
CustomerRouter.put(
  "/",
  async (req: Request<{}, {}, UpdateOneCustomerInterface>, res: Response) => {
    const updateCustomerSchema = Joi.object<UpdateOneCustomerInterface>({
      name: Joi.string().required(),
      accountStatus: Joi.string().optional(),
      businessId: Joi.string().optional(),
      jobTitle: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      source: Joi.string().optional(),
      id: Joi.number().required(),
    });
    const { error } = updateCustomerSchema.validate(req.body);
    if (error) {
      res.status(500).json(error);
    } else {
      try {
        const data = await controller.updateOne({
          ...req.body,
        });
        res.json(data);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  }
);
export default CustomerRouter;
