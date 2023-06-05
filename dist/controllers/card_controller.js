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
const prisma_1 = require("../services/prisma");
class CardController {
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userObj = req.user;
            const { title, description, typeId, columnId } = req.body;
            return yield prisma_1.prisma.task.create({
                data: {
                    title: title,
                    columnId: columnId,
                    cardTypeId: typeId,
                    description: description,
                    tenantId: userObj.tenantId,
                    order: 1
                }
            });
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            return yield prisma_1.prisma.task.update({
                where: {
                    id: body.cardId
                },
                data: {
                    columnId: body.columnId
                }
            });
        });
    }
    getOne(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { cardId } = req.query;
            return yield prisma_1.prisma.task.findFirst({
                where: {
                    tenantId: user.tenantId,
                    AND: { id: Number(cardId) }
                },
            });
        });
    }
}
exports.default = CardController;
