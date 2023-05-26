import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface CreateOneBusinessInterface {
  email: string;
  name: string;
  industry?: string;
  companySize?: string;
  website?: string;
}

export class BusinessController {
  public async createOne({
    email,
    name,
    companySize,
    industry,
    website,
  }: CreateOneBusinessInterface) {
    return await prisma.business.create({
      data: {
        email,
        name,
        companySize,
        industry,
        website,
      },
    });
  }
}
