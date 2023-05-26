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
exports.authenticateToken = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
const AuthRouter = (0, express_1.Router)();
const secretKey = "your-secret-key"; // Replace with your own secret key
const generateToken = (user) => {
    return (0, jsonwebtoken_1.sign)({ user }, secretKey, { expiresIn: "1h" });
};
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    (0, jsonwebtoken_1.verify)(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateToken = authenticateToken;
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
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = generateToken(user); // Implement the generateToken function
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
        password: joi_1.default.string().optional(),
        name: joi_1.default.string().email().required(),
    });
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
        res.status(500).json(error);
    }
    else {
        try {
            const { email, password, name } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = yield prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            res.json(newUser);
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}));
exports.default = AuthRouter;
