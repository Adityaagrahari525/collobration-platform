import { prisma } from "../../config/database";
import { CreateQuestionInput, UpdateQuestionInput, CreateAnswerInput, UpdateAnswerInput } from "../../validators/question.validator";

export class QuestionService {
  static async getQuestions(search?: string, department?: string, tag?: string) {
    const where: any = {};

    if (department) {
      where.department = { contains: department, mode: "insensitive" };
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            institution: true,
            profile: true,
          },
        },
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              include: {
                institution: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    return questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      content: q.description,
      authorId: q.authorId,
      authorName: q.isAnonymous ? "Anonymous Scholar" : (q.author ? `${q.author.firstName} ${q.author.lastName}` : "Academic Scholar"),
      authorRole: q.author ? `${q.author.profile?.academicYear || q.author.role}, ${q.author.institution.name}` : "IIT Delhi Scholar",
      authorAvatar: q.author?.profile?.avatarUrl || null,
      institution: q.author?.institution?.name || "IIT Delhi",
      department: q.department || q.author?.profile?.department || "Computer Science",
      subject: q.subject || "Academic Network",
      academicYear: q.academicYear || "2026",
      isAnonymous: q.isAnonymous ?? false,
      votes: q.votes ?? 0,
      userVoted: false,
      saved: false,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      answersCount: q.answers.length,
      answers: q.answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        authorId: a.authorId,
        authorName: a.author ? `${a.author.firstName} ${a.author.lastName}` : "Scholar Contributor",
        authorRole: a.author ? `${a.author.profile?.academicYear || a.author.role}, ${a.author.institution.name}` : "Scholar",
        authorAvatar: a.author?.profile?.avatarUrl || null,
        content: a.content,
        votes: a.upvotes ?? 0,
        isAccepted: a.isAccepted ?? false,
        isFacultyEndorsed: a.isFacultyEndorsed ?? false,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      tags: q.tags || [],
    }));
  }

  static async getQuestionById(id: string) {
    const q = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            institution: true,
            profile: true,
          },
        },
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              include: {
                institution: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!q) {
      const error: any = new Error("Question not found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: q.id,
      title: q.title,
      description: q.description,
      content: q.description,
      authorId: q.authorId,
      authorName: q.isAnonymous ? "Anonymous Scholar" : (q.author ? `${q.author.firstName} ${q.author.lastName}` : "Academic Scholar"),
      authorRole: q.author ? `${q.author.profile?.academicYear || q.author.role}, ${q.author.institution.name}` : "IIT Delhi Scholar",
      authorAvatar: q.author?.profile?.avatarUrl || null,
      institution: q.author?.institution?.name || "IIT Delhi",
      department: q.department || q.author?.profile?.department || "Computer Science",
      subject: q.subject || "Academic Network",
      academicYear: q.academicYear || "2026",
      isAnonymous: q.isAnonymous ?? false,
      votes: q.votes ?? 0,
      userVoted: false,
      saved: false,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      answersCount: q.answers.length,
      answers: q.answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        authorId: a.authorId,
        authorName: a.author ? `${a.author.firstName} ${a.author.lastName}` : "Scholar Contributor",
        authorRole: a.author ? `${a.author.profile?.academicYear || a.author.role}, ${a.author.institution.name}` : "Scholar",
        authorAvatar: a.author?.profile?.avatarUrl || null,
        content: a.content,
        votes: a.upvotes ?? 0,
        isAccepted: a.isAccepted ?? false,
        isFacultyEndorsed: a.isFacultyEndorsed ?? false,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      tags: q.tags || [],
    };
  }

  static async createQuestion(userId: string, input: CreateQuestionInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      const error: any = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const newQuestion = await prisma.question.create({
      data: {
        title: input.title,
        description: input.description,
        authorId: userId,
        institutionId: user.institutionId,
        department: input.department || user.profile?.department || "Computer Science",
        subject: input.subject || "Academic Network",
        academicYear: input.academicYear || "2026",
        isAnonymous: input.isAnonymous || false,
        tags: input.tags || ["Academic"],
        votes: 1,
      },
    });

    // Record user contribution point
    await prisma.contribution.create({
      data: {
        userId,
        type: "QUESTION_CREATED",
        description: `Posted question: '${input.title.slice(0, 45)}...'`,
        points: 5,
      },
    }).catch(() => {});

    return this.getQuestionById(newQuestion.id);
  }

  static async updateQuestion(id: string, userId: string, userRole: string, input: UpdateQuestionInput) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error("Question not found.");
      error.statusCode = 404;
      throw error;
    }

    if (existing.authorId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("Permission denied to edit this question.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.question.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description && { description: input.description }),
        ...(input.department && { department: input.department }),
        ...(input.subject && { subject: input.subject }),
        ...(input.academicYear && { academicYear: input.academicYear }),
        ...(input.tags && { tags: input.tags }),
      },
    });

    return this.getQuestionById(id);
  }

  static async deleteQuestion(id: string, userId: string, userRole: string) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error("Question not found.");
      error.statusCode = 404;
      throw error;
    }

    if (existing.authorId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("Permission denied to delete this question.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.question.delete({ where: { id } });
    return { message: "Question and associated answers successfully deleted from database." };
  }

  static async voteQuestion(id: string) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error("Question not found.");
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.question.update({
      where: { id },
      data: { votes: (existing.votes || 0) + 1 },
    });

    return { id: updated.id, votes: updated.votes };
  }

  static async createAnswer(questionId: string, userId: string, input: CreateAnswerInput) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      const error: any = new Error("Question not found.");
      error.statusCode = 404;
      throw error;
    }

    const newAnswer = await prisma.answer.create({
      data: {
        questionId,
        authorId: userId,
        content: input.content,
        proofDetails: input.proofDetails || null,
        upvotes: 1,
      },
    });

    // Record user contribution
    await prisma.contribution.create({
      data: {
        userId,
        type: "HELPFUL_ANSWER",
        description: "Submitted technical answer to peer question",
        points: 5,
      },
    }).catch(() => {});

    return this.getQuestionById(questionId);
  }

  static async updateAnswer(answerId: string, userId: string, userRole: string, input: UpdateAnswerInput) {
    const existing = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!existing) {
      const error: any = new Error("Answer not found.");
      error.statusCode = 404;
      throw error;
    }

    if (existing.authorId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("Permission denied to edit this answer.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.answer.update({
      where: { id: answerId },
      data: { content: input.content },
    });

    return this.getQuestionById(existing.questionId);
  }

  static async deleteAnswer(answerId: string, userId: string, userRole: string) {
    const existing = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!existing) {
      const error: any = new Error("Answer not found.");
      error.statusCode = 404;
      throw error;
    }

    if (existing.authorId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("Permission denied to delete this answer.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.answer.delete({ where: { id: answerId } });
    return { message: "Answer successfully deleted from database." };
  }

  static async acceptAnswer(answerId: string, userId: string) {
    const existing = await prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });

    if (!existing) {
      const error: any = new Error("Answer not found.");
      error.statusCode = 404;
      throw error;
    }

    if (existing.question.authorId !== userId) {
      const error: any = new Error("Only the question author can accept an answer.");
      error.statusCode = 403;
      throw error;
    }

    // Reset all other answers for this question to isAccepted: false
    await prisma.answer.updateMany({
      where: { questionId: existing.questionId },
      data: { isAccepted: false },
    });

    await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    });

    if (existing.authorId) {
      await prisma.contribution.create({
        data: {
          userId: existing.authorId,
          type: "ANSWER_ACCEPTED",
          description: "Answer marked as Accepted by Questioner",
          points: 10,
        },
      }).catch(() => {});
    }

    return this.getQuestionById(existing.questionId);
  }
}
