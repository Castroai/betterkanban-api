import { NextFunction, Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { PrismaClient } from "@prisma/client";
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { BoardController } from "./board_controller";
import { v4 as uuidv4 } from 'uuid';

const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const prisma = new PrismaClient();


// TODO

// update cognito to map email from google to email from cognito
// this way if user signs up with google, they can not resignup with email and password using their gmail account.
// SECTION : Map email from Google attribute to user pool attribute
// https://repost.aws/knowledge-center/cognito-google-social-identity-provider

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_SrjuGQBG1",
  tokenUse: "access",
  clientId: "5plb7q6vv8s2aa24crlq63a337",
});

const boardController = new BoardController()

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
      await verifier.verify(token as string)
      const command = new GetUserCommand(params);
      const response = await client.send(command);
      if (response.UserAttributes) {
        const email = response.UserAttributes.filter((value) => value.Name === 'email')[0].Value
        const userExistsInDb = await prisma.user.findUnique({
          where: {
            email: email
          }
        })
        if (userExistsInDb) {
          req.user = userExistsInDb
          return next();
        } else {
          if (response.UserAttributes) {
            if (email) {
              const newUser = await prisma.user.create({
                data: {
                  email: email,
                  name: '',
                  tenantId: uuidv4()
                }
              })
              req.user = newUser
              boardController.seedData(req).then(() => next())
            }
          }
        }
      }


    } catch (error) {
      console.error(error)
      return res.status(403).json({ error });
    }
  }
}
