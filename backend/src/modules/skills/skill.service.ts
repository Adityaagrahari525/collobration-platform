import { prisma } from "../../config/database";
import { QuerySkillsInput } from "../../validators/skill.validator";

export class SkillService {
  static async getSkills(query: QuerySkillsInput) {
    const { search, category } = query;
    const where: any = {};

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    return skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category || "General",
    }));
  }
}
