import prisma from "../../config/database";

export interface LogAuditParams {
  requestId: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
  ipHash?: string;
}

export class AuditService {
  static async log(params: LogAuditParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          requestId: params.requestId,
          actorId: params.actorId || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          metadata: params.metadata || null,
          ipHash: params.ipHash || null,
        },
      });
    } catch (err) {
      console.error("[AuditService] Failed to record audit log:", err);
    }
  }

  static async getLogs(query: { page?: number; limit?: number; actorId?: string; action?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.actorId) where.actorId = query.actorId;
    if (query.action) where.action = query.action;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
