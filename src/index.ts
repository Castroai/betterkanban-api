import express, { json } from "express";
import { AuthController } from "./controllers/auth_controller";
import cors from "cors";
import BoardRouter from "./routes/board_router";
const authController = new AuthController();
const authenticateToken = authController.authenticateToken;
const app = express();
const port = 5000;
app.use(cors());
app.use(json());
app.use("/board", authenticateToken, BoardRouter);
app.get('/health', (_req, res) => {
  res.status(200).send('Healthy API')
})
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
