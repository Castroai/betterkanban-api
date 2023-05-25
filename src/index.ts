import express, { json } from "express";
import UserRouter from "./routes/User.route";
import CustomerRouter from "./routes/Customer.route";
import BusinessRouter from "./routes/Business.route";
import AuthRouter, { authenticateToken } from "./routes/Auth.route";
const app = express();
const port = 5000;
app.use(json());
app.use("/", AuthRouter);
app.use("/user", authenticateToken, UserRouter);
app.use("/customer", authenticateToken, CustomerRouter);
app.use("/business", authenticateToken, BusinessRouter);
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
