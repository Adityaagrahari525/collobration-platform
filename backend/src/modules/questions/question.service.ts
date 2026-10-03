import prisma from "../../config/database";
import { CreateQuestionInput, UpdateQuestionInput, CreateAnswerInput, UpdateAnswerInput } from "../../validators/question.validator";
import { NotificationType, Role } from "@prisma/client";
import { AuditService } from "../audit/audit.service";

export class QuestionService {
  static async getQuestions(search?: string, department?: string, tag?: string, currentUserId?: string) {
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
        votes: true,
        bookmarks: true,
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              include: {
                institution: true,
                profile: true,
              },
            },
            votes: true,
            endorsedByFaculty: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return questions.map((q) => {
      const userVoted = currentUserId ? q.votes.some((v) => v.userId === currentUserId) : false;
      const saved = currentUserId ? q.bookmarks.some((b) => b.userId === currentUserId) : false;

      return {
        id: q.id,
        title: q.title,
        description: q.description,
        content: q.description,
        authorId: q.authorId,
        authorName: q.isAnonymous ? "Anonymous Scholar" : (q.author ? `${q.author.firstName} ${q.author.lastName}` : "Academic Scholar"),
        authorRole: q.author ? `${q.author.profile?.academicYear || q.author.role}, ${q.author.institution?.name || "IIT Delhi"}` : "IIT Delhi Scholar",
        authorAvatar: q.author?.profile?.avatarUrl || null,
        institution: q.author?.institution?.name || "IIT Delhi",
        department: q.department || q.author?.profile?.department || "Computer Science",
        subject: q.subject || "Academic Network",
        academicYear: q.academicYear || "2026",
        isAnonymous: q.isAnonymous ?? false,
        isResolved: q.isResolved,
        votes: q.votes.length,
        userVoted,
        saved,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
        answersCount: q.answers.length,
        answers: q.answers.map((a) => ({
          id: a.id,
          questionId: a.questionId,
          authorId: a.authorId,
          authorName: a.author ? `${a.author.firstName} ${a.author.lastName}` : "Scholar Contributor",
          authorRole: a.author ? `${a.author.profile?.academicYear || a.author.role}, ${a.author.institution?.name || "Scholar"}` : "Scholar",
          authorAvatar: a.author?.profile?.avatarUrl || null,
          content: a.content,
          votes: a.votes.length,
          userVoted: currentUserId ? a.votes.some((v) => v.userId === currentUserId) : false,
          isAccepted: a.isAccepted,
          isFacultyEndorsed: a.isFacultyEndorsed,
          endorsedByFaculty: a.endorsedByFaculty ? `${a.endorsedByFaculty.firstName} ${a.endorsedByFaculty.lastName}` : null,
          proofDetails: a.proofDetails,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        })),
        tags: q.tags || [],
      };
    });
  }

  static async getQuestionById(id: string, currentUserId?: string) {
    const q = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            institution: true,
            profile: true,
          },
        },
        votes: true,
        bookmarks: true,
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              include: {
                institution: true,
                profile: true,
              },
            },
            votes: true,
            endorsedByFaculty: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!q) {
      throw { statusCode: 404, message: "Question not found." };
    }

    const userVoted = currentUserId ? q.votes.some((v) => v.userId === currentUserId) : false;
    const saved = currentUserId ? q.bookmarks.some((b) => b.userId === currentUserId) : false;

    return {
      id: q.id,
      title: q.title,
      description: q.description,
      content: q.description,
      authorId: q.authorId,
      authorName: q.isAnonymous ? "Anonymous Scholar" : (q.author ? `${q.author.firstName} ${q.author.lastName}` : "Academic Scholar"),
      authorRole: q.author ? `${q.author.profile?.academicYear || q.author.role}, ${q.author.institution?.name || "IIT Delhi"}` : "IIT Delhi Scholar",
      authorAvatar: q.author?.profile?.avatarUrl || null,
      institution: q.author?.institution?.name || "IIT Delhi",
      department: q.department || q.author?.profile?.department || "Computer Science",
      subject: q.subject || "Academic Network",
      academicYear: q.academicYear || "2026",
      isAnonymous: q.isAnonymous,
      isResolved: q.isResolved,
      votes: q.votes.length,
      userVoted,
      saved,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      answersCount: q.answers.length,
      answers: q.answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        authorId: a.authorId,
        authorName: a.author ? `${a.author.firstName} ${a.author.lastName}` : "Scholar Contributor",
        authorRole: a.author ? `${a.author.profile?.academicYear || a.author.role}, ${a.author.institution?.name || "Scholar"}` : "Scholar",
        authorAvatar: a.author?.profile?.avatarUrl || null,
        content: a.content,
        votes: a.votes.length,
        userVoted: currentUserId ? a.votes.some((v) => v.userId === currentUserId) : false,
        isAccepted: a.isAccepted,
        isFacultyEndorsed: a.isFacultyEndorsed,
        endorsedByFaculty: a.endorsedByFaculty ? `${a.endorsedByFaculty.firstName} ${a.endorsedByFaculty.lastName}` : null,
        proofDetails: a.proofDetails,
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
      throw { statusCode: 404, message: "User not found." };
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

    return this.getQuestionById(newQuestion.id, userId);
  }

  static async updateQuestion(id: string, userId: string, userRole: string, input: UpdateQuestionInput) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw { statusCode: 404, message: "Question not found." };
    }

    if (existing.authorId !== userId && userRole !== Role.ADMIN) {
      throw { statusCode: 403, message: "Permission denied to edit this question." };
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

    return this.getQuestionById(id, userId);
  }

  static async deleteQuestion(id: string, userId: string, userRole: string) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw { statusCode: 404, message: "Question not found." };
    }

    if (existing.authorId !== userId && userRole !== Role.ADMIN) {
      throw { statusCode: 403, message: "Permission denied to delete this question." };
    }

    await prisma.question.delete({ where: { id } });
    return { message: "Question and associated answers successfully deleted from database." };
  }

  static async toggleVoteQuestion(questionId: string, userId: string) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw { statusCode: 404, message: "Question not found." };
    }

    const existingVote = await prisma.questionVote.findUnique({
      where: {
        questionId_userId: { questionId, userId },
      },
    });

    let voted = false;
    if (existingVote) {
      await prisma.questionVote.delete({
        where: { id: existingVote.id },
      });
      voted = false;
    } else {
      await prisma.questionVote.create({
        data: { questionId, userId },
      });
      voted = true;
    }

    const totalVotes = await prisma.questionVote.count({ where: { questionId } });
    return { questionId, votes: totalVotes, userVoted: voted };
  }

  static async toggleVoteAnswer(answerId: string, userId: string) {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw { statusCode: 404, message: "Answer not found." };
    }

    const existingVote = await prisma.answerVote.findUnique({
      where: {
        answerId_userId: { answerId, userId },
      },
    });

    let voted = false;
    if (existingVote) {
      await prisma.answerVote.delete({
        where: { id: existingVote.id },
      });
      voted = false;
    } else {
      await prisma.answerVote.create({
        data: { answerId, userId },
      });
      voted = true;
    }

    const totalVotes = await prisma.answerVote.count({ where: { answerId } });
    return { answerId, votes: totalVotes, userVoted: voted };
  }

  static async toggleBookmark(questionId: string, userId: string) {
    const existing = await prisma.questionBookmark.findUnique({
      where: {
        questionId_userId: { questionId, userId },
      },
    });

    let saved = false;
    if (existing) {
      await prisma.questionBookmark.delete({ where: { id: existing.id } });
      saved = false;
    } else {
      await prisma.questionBookmark.create({ data: { questionId, userId } });
      saved = true;
    }

    return { questionId, saved };
  }

  static async createAnswer(questionId: string, userId: string, input: CreateAnswerInput) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw { statusCode: 404, message: "Question not found." };
    }

    const newAnswer = await prisma.answer.create({
      data: {
        questionId,
        authorId: userId,
        content: input.content,
        proofDetails: input.proofDetails || null,
      },
    });

    // Notify question author
    if (question.authorId && question.authorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: question.authorId,
          type: NotificationType.QUESTION_ANSWERED,
          title: "New Answer to Your Question",
          message: `A peer posted an answer to "${question.title.slice(0, 45)}...".`,
          link: `/questions/${question.id}`,
          entityType: "Question",
          entityId: question.id,
        },
      });
    }

    // Record user contribution
    await prisma.contribution.create({
      data: {
        userId,
        type: "HELPFUL_ANSWER",
        description: "Submitted technical answer to peer question",
        points: 5,
      },
    }).catch(() => {});

    return this.getQuestionById(questionId, userId);
  }

  static async acceptAnswer(answerId: string, userId: string) {
    const existing = await prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });

    if (!existing) {
      throw { statusCode: 404, message: "Answer not found." };
    }

    if (existing.question.authorId !== userId) {
      throw { statusCode: 403, message: "Only the question author can accept an answer." };
    }

    // Toggle accept
    const newAcceptedState = !existing.isAccepted;

    await prisma.$transaction([
      prisma.answer.updateMany({
        where: { questionId: existing.questionId },
        data: { isAccepted: false },
      }),
      prisma.answer.update({
        where: { id: answerId },
        data: { isAccepted: newAcceptedState },
      }),
      prisma.question.update({
        where: { id: existing.questionId },
        data: { isResolved: newAcceptedState },
      }),
    ]);

    if (newAcceptedState && existing.authorId) {
      await prisma.notification.create({
        data: {
          userId: existing.authorId,
          type: NotificationType.ANSWER_ACCEPTED,
          title: "Your Answer Was Accepted! 🌟",
          message: `The question author accepted your solution to "${existing.question.title.slice(0, 45)}...".`,
          link: `/questions/${existing.questionId}`,
          entityType: "Question",
          entityId: existing.questionId,
        },
      });

      await prisma.contribution.create({
        data: {
          userId: existing.authorId,
          type: "ANSWER_ACCEPTED",
          description: "Answer marked as Accepted by Questioner",
          points: 15,
        },
      }).catch(() => {});
    }

    return this.getQuestionById(existing.questionId, userId);
  }

  static async endorseAnswer(answerId: string, facultyUserId: string, requestId: string) {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });

    if (!answer) {
      throw { statusCode: 404, message: "Answer not found." };
    }

    const updated = await prisma.answer.update({
      where: { id: answerId },
      data: {
        isFacultyEndorsed: true,
        endorsedByFacultyId: facultyUserId,
      },
    });

    if (answer.authorId) {
      await prisma.notification.create({
        data: {
          userId: answer.authorId,
          type: NotificationType.ANSWER_ENDORSED,
          title: "Faculty Endorsement Awarded! 🎓",
          message: `Verified faculty endorsed your technical answer on "${answer.question.title.slice(0, 45)}...".`,
          link: `/questions/${answer.questionId}`,
          entityType: "Question",
          entityId: answer.questionId,
        },
      });
    }

    await AuditService.log({
      requestId,
      actorId: facultyUserId,
      action: "FACULTY_ENDORSEMENT",
      entityType: "Answer",
      entityId: answerId,
      metadata: { questionId: answer.questionId },
    });

    return updated;
  }
}
