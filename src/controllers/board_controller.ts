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
    public async update(req: Request) {
        const body = req.body
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
        const userObj = req.user as User
        const { title, description, typeId, columnId } = req.body
        console.log(title, description, typeId, columnId)
        return await prisma.card.create({
            data: {
                title: title,
                columnId: columnId,
                typeId: typeId,
                description: description,
                tenantId: userObj.tenantId
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
    public async seedData(req: Request) {
        try {
            const userObj = req.user as User
            // Create a board
            const board = await prisma.board.create({
                data: {
                    name: "My Board",
                    tenantId: userObj.tenantId
                },
            });
            console.log(`Board "${board.name}" created successfully.`);
            // Create four columns
            await prisma.column.createMany({
                data: [
                    {
                        name: "Column 1",
                        boardId: board.id,
                        tenantId: userObj.tenantId
                    },
                    {
                        name: "Column 2",
                        boardId: board.id,
                        tenantId: userObj.tenantId
                    },
                    {
                        name: "Column 3",
                        boardId: board.id,
                        tenantId: userObj.tenantId
                    },
                    {
                        name: "Column 4",
                        boardId: board.id,
                        tenantId: userObj.tenantId
                    },
                ],
                skipDuplicates: true,
            });
            console.log(`Columns created successfully.`);


            const firstColumn = await prisma.column.findFirst({
                where: {
                    tenantId: userObj.tenantId,
                    AND: {
                        name: 'Column 1'
                    }
                },

            })
            // Create a card type & Card
            const cardType = await prisma.cardType.create({
                data: {
                    name: "Task",
                    tenantId: userObj.tenantId,
                    cards: {
                        create: {
                            title: "My First Card",
                            columnId: firstColumn!.id,
                            tenantId: userObj.tenantId
                        }
                    }
                },
            });
            console.log(`Card type "${cardType.name}" created successfully.`);
        } catch (error) {
            console.error("Error seeding data:", error);
        } finally {
            await prisma.$disconnect();
        }
    }
}