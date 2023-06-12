import express, { json } from "express";
import { AuthController } from "./controllers";
import {
  BoardRouter,
  CardRouter,
  OpenaiRouter,
  cardTypeRouter,
} from "./routers";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import cors from "cors";
import { User } from "@prisma/client";
import { client } from "./controllers/auth_controller";
import { prisma } from "./services/prisma";
const authController = new AuthController();
const authenticateToken = authController.authenticateToken;
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(json());
app.use("/board", authenticateToken, BoardRouter);
app.use("/card", authenticateToken, CardRouter);
app.use("/card_type", authenticateToken, cardTypeRouter);
app.use("/openai", OpenaiRouter);
app.post("/invite", authenticateToken, async (req, res) => {
  const client = new SESClient({ region: process.env.REGION });
  // Define the email details
  const { invitedUser } = req.body;
  const { tenantId } = req.user as User;
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
  const command = new SendEmailCommand({
    Source: senderEmail,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: message,
  });
  try {
    const response = await client.send(command);
    console.log("Email sent successfully:", response.MessageId);
    res.status(200).send("ok");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("ok");
  }
});
app.post("/complete-invite", async (req, res) => {
  const { email, tenantid, secret, password } = req.body;
  // Create the user
  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.USER_POOL_ID || "",
    Username: email,
    TemporaryPassword: "YourNewPassword2023",
  });
  const newUserResponse = await client.send(command);
  console.log(newUserResponse);
  const passwordCommand = new AdminSetUserPasswordCommand({
    UserPoolId: process.env.USER_POOL_ID || "",
    Username: email,
    Password: password,
    Permanent: true, // Optional, specify whether the password is permanent or temporary
  });
  const response = await client.send(passwordCommand);
  console.log(response);
  const newUser = await prisma.user.create({
    data: {
      username: email,
      email: email,
      tenant: {
        connect: { id: Number(tenantid) },
      },
    },
  });
  console.log(newUser);
  res.send(response);
});

app.get("/users", authenticateToken, async (req, res) => {
  const { tenantId } = req.user as User;
  const data = await prisma.user.findMany({
    where: {
      tenantId: tenantId,
    },
  });
  res.status(200).send(data);
});
app.get("/health", (_req, res) => {
  res.status(200).send("Healthy");
});
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
