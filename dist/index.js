"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const controllers_1 = require("./controllers");
const routers_1 = require("./routers");
const cors_1 = __importDefault(require("cors"));
const authController = new controllers_1.AuthController();
const authenticateToken = authController.authenticateToken;
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use("/board", authenticateToken, routers_1.BoardRouter);
app.use('/card', authenticateToken, routers_1.CardRouter);
app.use('/card_type', authenticateToken, routers_1.cardTypeRouter);
app.use('/openai', routers_1.OpenaiRouter);
app.get('/health', (_req, res) => {
    res.status(200).send('Healthy API');
});
app.listen(port, () => {
    console.log(`Running on ${port}`);
});
