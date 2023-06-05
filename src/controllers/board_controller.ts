import { User } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../services/prisma";


export default class BoardController {
    public async fetchAll(req: Request) {
        const user = req.user as User
        return await prisma.board.findMany({
            where: {
                tenantId: user.tenantId
            }, include: {
                columns: {
                    include: {
                        tasks: {
                            include: {
                                cardType: true
                            }
                        },
                    }, orderBy: {
                        order: 'asc',

                    }

                }
            }
        })
    }
}