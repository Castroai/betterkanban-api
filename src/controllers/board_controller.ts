import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";

const prisma = new PrismaClient();

export class BoardController {
    constructor() { }
    public async fetchAll(req: Request) {
        const user = req.user as User
        return await prisma.board.findMany({
            where: {
                tenantId: user.tenantId
            }, include: {
                columns: {
                    include: {
                        cards: {
                            include: {
                                type: true
                            }
                        }
                    }
                }
            }
        })
    }
    public async createDefault(req: Request) {
        const user = req.user as User
        // Create Columns
        const boardsWithColumns = await prisma.board.create({
            data: {
                tenantId: user.tenantId,
                name: "My Board",
                columns: {
                    createMany: {
                        data: [
                            {
                                name: 'Todo',
                            }, {
                                name: 'Working on it'
                            }, {
                                name: 'In Review'
                            }, {
                                name: 'In Stage QA'
                            }, {
                                name: 'In Production'
                            }],
                    },
                },
            }
        })
        const newType = await prisma.cardType.create({
            data: {
                name: "Story",
                tenantId: user.tenantId
            }
        })
        // Todo Colum
        const column = await prisma.column.findFirst({
            where: {
                boardId: boardsWithColumns.id,
                AND: {
                    name: {
                        equals: "Todo"
                    }
                }
            }
        })
        // Create card in Todo
        await prisma.card.create({
            data: {
                title: "My Card",
                tenantId: user.tenantId,
                type: {
                    connect: {
                        id: newType.id
                    }
                },
                column: {
                    connect: {
                        id: column?.id
                    }
                }
            }
        })
    }
    public async update(req: Request) {
        const body = req.body
        console.log(body)
        return await prisma.card.update({
            where: {
                id: body.cardId
            },
            data: {
                columnId: body.columnId
            }
        })

    }
    public async createCard(req: Request) {
        const { title, description, typeId, columnId } = req.body
        console.log(title, description, typeId, columnId)
        return await prisma.card.create({
            data: {
                title: title,
                columnId: columnId,
                typeId: typeId,
                description: description
            }
        })
    }
    public async fetchAllCardTypes(req: Request) {
        const user = req.user as User
        return await prisma.cardType.findMany({
            where: {
                tenantId: user.tenantId
            }
        })
    }
}