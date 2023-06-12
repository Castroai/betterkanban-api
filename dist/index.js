"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const controllers_1 = require("./controllers");
const routers_1 = require("./routers");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider"); // ES Modules import
const client_ses_1 = require("@aws-sdk/client-ses");
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = require("./controllers/auth_controller");
const authController = new controllers_1.AuthController();
const authenticateToken = authController.authenticateToken;
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use("/board", authenticateToken, routers_1.BoardRouter);
app.use("/card", authenticateToken, routers_1.CardRouter);
app.use("/card_type", authenticateToken, routers_1.cardTypeRouter);
app.use("/openai", routers_1.OpenaiRouter);
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    const input = {
        ClientId: "5plb7q6vv8s2aa24crlq63a337",
        Password: password,
        Username: email,
    };
    const command = new client_cognito_identity_provider_1.SignUpCommand(input);
    const response = yield auth_controller_1.client.send(command);
    console.log(response);
    res.status(200).send(response);
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cognitoIdentityProviderClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient(auth_controller_1.client);
    const { email, password } = req.body;
    console.log(email, password);
    const input = {
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
        ClientId: "5plb7q6vv8s2aa24crlq63a337",
    };
    const command = new client_cognito_identity_provider_1.InitiateAuthCommand(input);
    const response = yield cognitoIdentityProviderClient.send(command);
    console.log(response);
    res.status(200).send(response);
}));
app.post("/invite", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new client_ses_1.SESClient({ region: process.env.REGION });
    // Define the email details
    const { invitedUser } = req.body;
    const { tenantId } = req.user;
    const senderEmail = "welcome@betterkanban.com";
    const recipientEmail = invitedUser;
    const subject = "Hello from AWS SES!";
    const secret = "SECRET";
    const url = `https://betterkanban.com/invite/?email=${invitedUser}&tenant=${tenantId}&secret=${secret}`;
    const body = `Welcome to the team Visit ${url}`;
    // Construct the email message
    const message = {
        Subject: {
            Data: subject,
        },
        Body: {
            Text: {
                Data: body,
            },
        },
    };
    // Send the email
    const command = new client_ses_1.SendEmailCommand({
        Source: senderEmail,
        Destination: {
            ToAddresses: [recipientEmail],
        },
        Message: message,
    });
    try {
        const response = yield client.send(command);
        console.log("Email sent successfully:", response.MessageId);
        res.status(200).send("ok");
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("ok");
    }
}));
app.get("/health", (_req, res) => {
    res.status(200).send("Healthy");
});
app.listen(port, () => {
    console.log(`Running on ${port}`);
});
