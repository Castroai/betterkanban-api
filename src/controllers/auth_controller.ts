import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

const prisma = new PrismaClient();

interface CreateNewUserInterface {
  email: string;
  password: string;
  name: string;
}
interface SignInUserInterface {
  email: string;
  password: string;
}
export class AuthController {
  secretKey = "your-secret-key";

  public authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    verify(token, this.secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  }

  public async register({ email, name, password }: CreateNewUserInterface) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      throw Error("User already exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
    }
  }
  private generateToken(user: User) {
    return sign({ user }, this.secretKey, { expiresIn: "1h" });
  }
  public async login({ email, password }: SignInUserInterface) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    return this.generateToken(user); // Implement the generateToken function
  }
}
