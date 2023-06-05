import { NextFunction, Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { prisma } from "../services/prisma";
import { v4 as uuidv4 } from 'uuid';

const client = new CognitoIdentityProviderClient({ region: process.env.REGION });


// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID || "",
  tokenUse: "access",
  clientId: process.env.CLIENT_ID || "",
});


export default class AuthController {
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
              const tenant = await prisma.tenant.create({
                data: {
                  name: uuidv4(),
                }
              })
              const userObj = await prisma.user.create({
                data: {
                  email: email,
                  username: uuidv4(),
                  tenant: {
                    connect: {
                      id: tenant.id
                    }
                  }
                }
              })

              // Create a board
              const board = await prisma.board.create({
                data: {
                  title: uuidv4(),
                  ownerId: userObj.id,
                  tenantId: tenant.id
                },
              });
              console.log(`Board "${board.title}" created successfully.`);
              // Create four columns
              // Create the columns and associate with the board
              const columnTitles = ['To Do', 'In Progress', 'Review', 'Done'];
              const columns = await Promise.all(
                columnTitles.map((title, index) =>
                  prisma.column.create({
                    data: {
                      title,
                      order: index + 1,
                      board: {
                        connect: { id: board.id },
                      },
                      tenant: {
                        connect: { id: tenant.id }
                      }
                    },
                  })
                )
              );
              console.log(columns)
              console.log(`Columns created successfully.` + columns);
              // Create a card type & Card
              const cardType = await prisma.cardType.create({
                data: {
                  name: "Task",
                  tenant: {
                    connect: {
                      id: tenant.id
                    }
                  },
                },
              });
              await prisma.task.create({
                data: {
                  title: "My First Task",
                  description: "AI CONTENT GOES HERE",
                  cardType: {
                    connect: { id: cardType.id },
                  },
                  tenant: {
                    connect: {
                      id: tenant.id
                    }
                  },
                  column: {
                    connect: {
                      id: columns[0].id,
                    }
                  },
                  order: 1
                },
              });
              console.log(`Card type "${cardType.name}" created successfully.`);
              req.user = userObj
              return next()
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
