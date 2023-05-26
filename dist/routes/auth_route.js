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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_controller_1 = require("../controllers/auth_controller");
const AuthRouter = (0, express_1.Router)();
const controller = new auth_controller_1.AuthController();
AuthRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserSchema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().optional(),
    });
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
        res.status(500).json(error);
    }
    else {
        try {
            const { email, password } = req.body;
            const token = yield controller.login({ email, password });
            res.json({ token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}));
AuthRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registerUserSchema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
    });
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
        res.status(500).json(error);
    }
    else {
        try {
            const { email, password, name } = req.body;
            const newUser = yield controller.register({ email, password, name });
            res.json(newUser);
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}));
exports.default = AuthRouter;
