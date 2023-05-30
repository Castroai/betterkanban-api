import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { CognitoJwtVerifier } from "aws-jwt-verify";

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
// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_SrjuGQBG1",
  tokenUse: "access",
  clientId: "5plb7q6vv8s2aa24crlq63a337",
});
export class AuthController {
  secretKey = "your-secret-key";


  public async authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];
    console.log(req.headers)
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const payload = await verifier.verify(token as string)
      console.log("Token is valid. Payload:", payload);
      next();
    } catch (error) {
      console.error(error)
      return res.status(403).json({ error });
    }


    // verify(token, this.secretKey, (err, decoded) => {
    //   if (err) {
    //     return res.status(403).json({ error: "Invalid token" });
    //   }
    //   req.user = decoded;
    //   next();
    // });
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
