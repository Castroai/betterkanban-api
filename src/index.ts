import express, { json } from "express";
import { AuthController } from "./controllers";
import { BoardRouter, CardRouter, OpenaiRouter, cardTypeRouter } from "./routers";
import cors from "cors";
const authController = new AuthController();
const authenticateToken = authController.authenticateToken;
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(json());
app.use("/board", authenticateToken, BoardRouter);
app.use('/card', authenticateToken, CardRouter)
app.use('/card_type', authenticateToken, cardTypeRouter)
app.use('/openai', OpenaiRouter)
app.get('/health', (_req, res) => {
  res.status(200).send('Healthy API')
})
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
