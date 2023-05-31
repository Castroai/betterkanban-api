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
exports.AuthController = void 0;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const client_1 = require("@prisma/client");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({ region: 'us-east-1' });
const prisma = new client_1.PrismaClient();
// Verifier that expects valid access tokens:
const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: "us-east-1_SrjuGQBG1",
    tokenUse: "access",
    clientId: "5plb7q6vv8s2aa24crlq63a337",
});
class AuthController {
    authenticateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers["authorization"];
            if (!token) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                const payload = yield verifier.verify(token);
                console.log("Token is valid. Payload:", payload);
                const userExistsInDb = yield prisma.user.findUnique({
                    where: {
                        cognitoUsername: payload.sub
                    }
                });
                if (userExistsInDb) {
                    req.user = userExistsInDb;
                    next();
                }
                else {
                    const params = {
                        AccessToken: token,
                    };
                    const command = new client_cognito_identity_provider_1.GetUserCommand(params);
                    const response = yield client.send(command);
                    if (response.UserAttributes) {
                        const email = response.UserAttributes.filter((value) => value.Name === 'email')[0].Value;
                        if (email) {
                            const newUser = yield prisma.user.create({
                                data: {
                                    cognitoUsername: payload.username,
                                    email: email,
                                    name: '',
                                }
                            });
                            req.user = newUser;
                            next();
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
exports.AuthController = AuthController;
