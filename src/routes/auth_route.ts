import { Router } from "express";
import Joi from "joi";
import { AuthController } from "../controllers/auth_controller";

const AuthRouter = Router();

const controller = new AuthController();

AuthRouter.get("/", (req, res) => {
  res.status(200).send("Secure Data");
});

AuthRouter.post("/login", async (req, res) => {
  const loginUserSchema = Joi.object<{
    email: string;
    password: string;
  }>({
    email: Joi.string().email().required(),
    password: Joi.string().optional(),
  });
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    res.status(500).json(error);
  } else {
    try {
      const { email, password } = req.body;
      const token = await controller.login({ email, password });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
});

AuthRouter.post("/register", async (req, res) => {
  const registerUserSchema = Joi.object<{
    email: string;
    password: string;
    name: string;
  }>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  });
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    res.status(500).json(error);
  } else {
    try {
      const { email, password, name } = req.body;
      const newUser = await controller.register({ email, password, name });
      res.json(newUser);
    } catch (error) {
      const Err = error as {
        message: string;
      };
      res.status(500).json({ error: Err.message });
    }
  }
});

export default AuthRouter;
