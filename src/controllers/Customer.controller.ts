import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface CreateOneCustomerInterface {
  email: string;
  name: string;
  businessId?: number;
  phoneNumber?: string;
  jobTitle?: string;
  accountStatus?: string;
  source?: string;
}
export interface UpdateOneCustomerInterface {
  name: string;
  businessId?: number;
  phoneNumber?: string;
  jobTitle?: string;
  accountStatus?: string;
  source?: string;
  id: number;
}

export class CustomerContoller {
  public async createOne({
    email,
    name,
    businessId,
    phoneNumber,
    accountStatus,
    jobTitle,
    source,
  }: CreateOneCustomerInterface) {
    return await prisma.customer.create({
      data: {
        email,
        name,
        businessId,
        phoneNumber,
        accountStatus,
        jobTitle,
        source,
      },
    });
  }
  public async updateOne({
    id,
    name,
    accountStatus,
    businessId,
    jobTitle,
    phoneNumber,
    source,
  }: UpdateOneCustomerInterface) {
    return await prisma.customer.update({
      where: {
        id,
      },
      data: { name, accountStatus, businessId, jobTitle, phoneNumber, source },
    });
  }
}
