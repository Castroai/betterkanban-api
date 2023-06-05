"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardTypeRouter = exports.CardRouter = exports.OpenaiRouter = exports.BoardRouter = void 0;
const board_router_1 = __importDefault(require("./board_router"));
exports.BoardRouter = board_router_1.default;
const openai_router_1 = __importDefault(require("./openai_router"));
exports.OpenaiRouter = openai_router_1.default;
const card_router_1 = __importDefault(require("./card_router"));
exports.CardRouter = card_router_1.default;
const card_type_router_1 = __importDefault(require("./card_type_router"));
exports.cardTypeRouter = card_type_router_1.default;
