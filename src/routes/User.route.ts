import { Request, Response, Router } from "express";

const UserRouter = Router();

UserRouter.get("/me", (req: Request, res: Response) => {
  res.send(req.user);
});
export default UserRouter;
