import { Router } from "express";
import { OpenaiController } from "../controllers";

const controller = new OpenaiController()
const OpenaiRouter = Router();

OpenaiRouter.get('/', async (_req, res) => {
    controller.generatePrompt()
    const response = await controller.submitPrompt()
    console.log(response)
    res.status(200).json(response)
})

export default OpenaiRouter 