import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";

const prisma = new PrismaClient();

export class BoardController {
    constructor() { }
    public async fetchAll(req: Request) {
        const user = req.user as User
        return await prisma.board.findMany({
            where: {
                userId: user.id
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
}