import { prisma } from "../../config/database";

export class InstitutionService {
  static async getAllInstitutions(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
        { emailDomain: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.institution.findMany({
      where,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        emailDomain: true,
        city: true,
        state: true,
        country: true,
        isVerified: true,
      },
    });
  }

  static async getInstitutionById(id: string) {
    const inst = await prisma.institution.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        emailDomain: true,
        city: true,
        state: true,
        country: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!inst) {
      const error: any = new Error("Academic institution node not found.");
      error.statusCode = 404;
      throw error;
    }

    return inst;
  }

  static async findByDomain(email: string) {
    const domain = email.split("@")[1];
    if (!domain) return null;
    return prisma.institution.findFirst({
      where: {
        emailDomain: {
          equals: domain,
          mode: "insensitive",
        },
      },
    });
  }
}
