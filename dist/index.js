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
const customer_route_1 = __importDefault(require("./routes/customer_route"));
const business_route_1 = __importDefault(require("./routes/business_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const auth_controller_1 = require("./controllers/auth_controller");
const authController = new auth_controller_1.AuthController();
const authenticateToken = authController.authenticateToken;
const app = (0, express_1.default)();
const port = 5000;
app.use((0, express_1.json)());
app.use("/", auth_route_1.default);
app.use("/customer", authenticateToken, customer_route_1.default);
app.use("/business", authenticateToken, business_route_1.default);
app.listen(port, () => {
    console.log(`Running on ${port}`);
});
