import { Router } from "express";
import { OpenaiController } from "../controllers";

const controller = new OpenaiController()
const OpenaiRouter = Router();

OpenaiRouter.post('/', async (req, res) => {
    // controller.generatePrompt()
    const response = await controller.submitPrompt(req)
    console.log(response)
    res.status(200).send(response)
})

export default OpenaiRouter 