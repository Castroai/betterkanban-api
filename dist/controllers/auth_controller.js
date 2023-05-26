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
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
class AuthController {
    constructor() {
        this.secretKey = "your-secret-key";
    }
    authenticateToken(req, res, next) {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        (0, jsonwebtoken_1.verify)(token, this.secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid token" });
            }
            req.user = decoded;
            next();
        });
    }
    register({ email, name, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            return yield prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
        });
    }
    generateToken(user) {
        return (0, jsonwebtoken_1.sign)({ user }, this.secretKey, { expiresIn: "1h" });
    }
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid credentials");
            }
            return this.generateToken(user); // Implement the generateToken function
        });
    }
}
exports.AuthController = AuthController;
