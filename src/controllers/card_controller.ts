import { User } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../services/prisma";
export default class CardController {
    public async create(req: Request) {
        const userObj = req.user as User
        const { title, description, typeId, columnId } = req.body
        return await prisma.task.create({
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
        })
    }
    public async update(req: Request) {
        const { cardId, columnId } = req.body
        return await prisma.task.update({
            where: {
                id: cardId
            },
            data: {
                columnId: columnId
            }
        })

    }
    public async getOne(req: Request) {
        const user = req.user as User
        const { cardId } = req.query
        return await prisma.task.findFirst({
            where: {
                tenantId: user.tenantId!,
                AND: { id: Number(cardId) }
            },
        })
    }
    public async updateDetails(id: number, req: Request) {
        const body = req.body
        return await prisma.task.update({
            where: {
                id: id
            },
            data: {
                // title
                // description,
                ...body
            }
        })
    }
    public async deleteOne(id: number) {
        return await prisma.task.delete({
            where: {
                id: id
            },

        })
    }
}