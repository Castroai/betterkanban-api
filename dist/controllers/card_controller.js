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
                    cardType: {
                        connect: {
                            id: typeId
                        }
                    },
                    column: {
                        connect: {
                            id: columnId
                        }
                    },
                    title: title,
                    description: description,
                    order: 1,
                    tenant: {
                        connect: {
                            id: userObj.tenantId
                        }
                    }
                }
            });
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cardId, columnId } = req.body;
            return yield prisma_1.prisma.task.update({
                where: {
                    id: cardId
                },
                data: {
                    columnId: columnId
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
    updateDetails(id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            return yield prisma_1.prisma.task.update({
                where: {
                    id: id
                },
                data: Object.assign({}, body)
            });
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.task.delete({
                where: {
                    id: id
                },
            });
        });
    }
}
exports.default = CardController;
