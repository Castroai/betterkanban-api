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
const controller = new controllers_1.CardController();
const CardRouter = (0, express_1.Router)();
CardRouter.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield controller.update(req);
    res.status(200).json(data);
}));
CardRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield controller.updateDetails(Number(req.params.id), req);
    res.status(200).json(data);
}));
CardRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield controller.deleteOne(Number(req.params.id));
    res.status(200).json(data);
}));
CardRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield controller.getOne(req);
    res.status(200).json(data);
}));
CardRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield controller.create(req);
    res.status(200).json(data);
}));
exports.default = CardRouter;
