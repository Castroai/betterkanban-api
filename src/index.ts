import express, { json } from "express";
import CustomerRouter from "./routes/customer_route";
import BusinessRouter from "./routes/business_route";
import { AuthController } from "./controllers/auth_controller";
import cors from "cors";
import ProfileRouter from "./routes/profile_router";
const authController = new AuthController();
const authenticateToken = authController.authenticateToken;
const app = express();
const port = 3000;
app.use(cors());
app.use(json());
app.use("/", authenticateToken, ProfileRouter);
app.use("/customer", authenticateToken, CustomerRouter);
app.use("/business", authenticateToken, BusinessRouter);
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
