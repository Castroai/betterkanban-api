import { NextFunction, Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { PrismaClient } from "@prisma/client";
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const prisma = new PrismaClient();
// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_SrjuGQBG1",
  tokenUse: "access",
  clientId: "5plb7q6vv8s2aa24crlq63a337",
});
export class AuthController {
  public async authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const params = {
        AccessToken: token as string,
      };
      const payload = await verifier.verify(token as string)
      const command = new GetUserCommand(params);
      const response = await client.send(command);
      const userExistsInDb = await prisma.user.findUnique({
        where: {
          cognitoUsername: payload.sub
        }
      })
      if (userExistsInDb) {
        req.user = userExistsInDb
        return next();
      } else {
        if (response.UserAttributes) {
          const email = response.UserAttributes.filter((value) => value.Name === 'email')[0].Value
          if (email) {
            const newUser = await prisma.user.create({
              data: {
                cognitoUsername: payload.sub,
                email: email,
                name: '',
              }
            })
            req.user = newUser
            next();
          }
        }
      }
    } catch (error) {
      console.error(error)
      return res.status(403).json({ error });
    }
  }
}
