import { Router } from "express";
import { ProfileController } from "../controllers/profile_controller";

const ProfileRouter = Router();

const controller = new ProfileController();

ProfileRouter.get("/", (req, res) => {
  res.status(200).send("Secure Data");
});


export default ProfileRouter;
