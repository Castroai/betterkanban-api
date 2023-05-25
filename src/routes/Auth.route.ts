import { NextFunction, Router, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import Joi from "joi";
const prisma = new PrismaClient();
const AuthRouter = Router();

const secretKey = "your-secret-key"; // Replace with your own secret key

const generateToken = (user: User) => {
  return sign({ user }, secretKey, { expiresIn: "1h" });
};

export const authenticateToken = (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

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
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = generateToken(user); // Implement the generateToken function
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
    password: Joi.string().optional(),
    name: Joi.string().email().required(),
  });
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    res.status(500).json(error);
  } else {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
});

export default AuthRouter;
