"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_jwt_verify_1 = require("aws-jwt-verify");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const prisma_1 = require("../services/prisma");
const uuid_1 = require("uuid");
const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({ region: process.env.REGION });
// Verifier that expects valid access tokens:
const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID || "",
    tokenUse: "access",
    clientId: process.env.CLIENT_ID || "",
});
class AuthController {
    authenticateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers["authorization"];
            if (!token) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                const params = {
                    AccessToken: token,
                };
                yield verifier.verify(token);
                const command = new client_cognito_identity_provider_1.GetUserCommand(params);
                const response = yield client.send(command);
                if (response.UserAttributes) {
                    const email = response.UserAttributes.filter((value) => value.Name === 'email')[0].Value;
                    const userExistsInDb = yield prisma_1.prisma.user.findUnique({
                        where: {
                            email: email
                        }
                    });
                    if (userExistsInDb) {
                        req.user = userExistsInDb;
                        return next();
                    }
                    else {
                        if (response.UserAttributes) {
                            if (email) {
                                const tenant = yield prisma_1.prisma.tenant.create({
                                    data: {
                                        name: (0, uuid_1.v4)(),
                                    }
                                });
                                const userObj = yield prisma_1.prisma.user.create({
                                    data: {
                                        email: email,
                                        username: (0, uuid_1.v4)(),
                                        tenant: {
                                            connect: {
                                                id: tenant.id
                                            }
                                        }
                                    }
                                });
                                // Create a board
                                const board = yield prisma_1.prisma.board.create({
                                    data: {
                                        title: (0, uuid_1.v4)(),
                                        ownerId: userObj.id,
                                        tenantId: tenant.id
                                    },
                                });
                                console.log(`Board "${board.title}" created successfully.`);
                                // Create four columns
                                // Create the columns and associate with the board
                                const columnTitles = ['To Do', 'In Progress', 'Review', 'Done'];
                                const columns = yield Promise.all(columnTitles.map((title, index) => prisma_1.prisma.column.create({
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
                                })));
                                console.log(columns);
                                console.log(`Columns created successfully.` + columns);
                                // Create a card type & Card
                                const cardType = yield prisma_1.prisma.cardType.create({
                                    data: {
                                        name: "Task",
                                        tenant: {
                                            connect: {
                                                id: tenant.id
                                            }
                                        },
                                    },
                                });
                                yield prisma_1.prisma.task.create({
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
                                req.user = userObj;
                                return next();
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error(error);
                return res.status(403).json({ error });
            }
        });
    }
}
exports.default = AuthController;
