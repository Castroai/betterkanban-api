import express, { json } from "express";
import { AuthController } from "./controllers";
import {
  BoardRouter,
  CardRouter,
  OpenaiRouter,
  cardTypeRouter,
} from "./routers";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import cors from "cors";
import { User } from "@prisma/client";
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
app.get("/health", (_req, res) => {
  res.status(200).send("Healthy");
});
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
