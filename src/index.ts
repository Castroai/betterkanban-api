import express, { json } from "express";
import CustomerRouter from "./routes/customer_route";
import BusinessRouter from "./routes/business_route";
import AuthRouter from "./routes/auth_route";
import { AuthController } from "./controllers/auth_controller";
const authController = new AuthController();
const authenticateToken = authController.authenticateToken;
const app = express();
const port = 80;
app.use(json());
app.use("/", AuthRouter);
app.use("/customer", authenticateToken, CustomerRouter);
app.use("/business", authenticateToken, BusinessRouter);
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
