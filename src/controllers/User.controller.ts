import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface GetOneUserInterface {
  id: number;
}

export class UserContoller {
  public async getOne({ id }: GetOneUserInterface) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
