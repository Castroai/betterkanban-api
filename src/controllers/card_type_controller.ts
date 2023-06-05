import { User } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../services/prisma";

export default class CardTypeController {
    public async fetchAll(req: Request) {
        const user = req.user as User
        return await prisma.cardType.findMany({
            where: {
                tenantId: user.tenantId
            }
        })
    }

}