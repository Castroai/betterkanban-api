"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const controller = new controllers_1.OpenaiController();
const OpenaiRouter = (0, express_1.Router)();
OpenaiRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    controller.generatePrompt();
    const response = yield controller.submitPrompt();
    console.log(response);
    res.status(200).json(response);
}));
exports.default = OpenaiRouter;
