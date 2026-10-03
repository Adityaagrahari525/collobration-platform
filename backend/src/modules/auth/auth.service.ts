import crypto from "crypto";
import { prisma } from "../../config/database";
import { hashPassword, comparePassword } from "../../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../../utils/jwt";
import { RegisterInput, LoginInput } from "../../validators/auth.validator";

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      const error: any = new Error("An account with this email address already exists.");
      error.statusCode = 400;
      throw error;
    }

    const institution = await prisma.institution.findUnique({
      where: { id: input.institutionId },
    });

    if (!institution) {
      const error: any = new Error("Selected academic institution node does not exist.");
      error.statusCode = 400;
      throw error;
    }

    // Check institutional email domain alignment
    const emailDomain = input.email.toLowerCase().split("@")[1];
    const isDomainMatch =
      emailDomain === institution.emailDomain.toLowerCase() ||
      emailDomain.endsWith("." + institution.emailDomain.toLowerCase()) ||
      emailDomain.endsWith(".ac.in") ||
      emailDomain.endsWith(".edu.in") ||
      emailDomain.endsWith(".edu");

    const passwordHash = await hashPassword(input.password);

    // Create User & UserProfile in a transaction
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        institutionId: input.institutionId,
        isEmailVerified: isDomainMatch, // Auto-verify if domain matches
        profile: {
          create: {
            department: input.department || "General Academic Roster",
            academicYear: input.academicYear || "Enrolled Scholar",
            bio: `${input.role.toLowerCase()} researcher at ${institution.name}`,
          },
        },
      },
      include: {
        institution: true,
        profile: true,
      },
    });

    // Generate Email Verification Token for development path
    const rawVerificationToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawVerificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Generate Initial Auth Session Tokens
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        institution: user.institution,
        profile: user.profile,
      },
      accessToken,
      refreshToken,
      verificationDevToken: rawVerificationToken,
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        institution: true,
        profile: true,
      },
    });

    // Generic error to prevent account enumeration
    if (!user || !user.isActive) {
      const error: any = new Error("Invalid institutional email or password.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error("Invalid institutional email or password.");
      error.statusCode = 401;
      throw error;
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        institution: user.institution,
        profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        institution: true,
        profile: true,
        userSkills: {
          include: { skill: true },
        },
      },
    });

    if (!user) {
      const error: any = new Error("User record not found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      institution: user.institution.name,
      institutionDetail: user.institution,
      department: user.profile?.department || "",
      degree: user.profile?.academicYear || "",
      bio: user.profile?.bio || "",
      avatar: user.profile?.avatarUrl || "",
      skills: user.userSkills.map((s: any) => s.skill.name),
      profile: user.profile,
    };
  }

  static async refresh(refreshTokenStr: string) {
    const decoded = verifyRefreshToken(refreshTokenStr);
    if (!decoded) {
      const error: any = new Error("Session expired or invalid refresh token.");
      error.statusCode = 401;
      throw error;
    }

    const hashed = hashToken(refreshTokenStr);
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        userId: decoded.userId,
        tokenHash: hashed,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      const error: any = new Error("Refresh token revoked or expired.");
      error.statusCode = 401;
      throw error;
    }

    // Revoke old token & issue new tokens (Token Rotation)
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });

    const payload = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        userId: decoded.userId,
        tokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(userId: string, refreshTokenStr?: string) {
    if (refreshTokenStr) {
      const hashed = hashToken(refreshTokenStr);
      await prisma.refreshToken.updateMany({
        where: { userId, tokenHash: hashed },
        data: { isRevoked: true },
      });
    } else {
      await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    }

    return { message: "Successfully logged out of institutional session." };
  }

  static async verifyEmail(tokenStr: string) {
    const hashed = hashToken(tokenStr);
    const record = await prisma.emailVerificationToken.findFirst({
      where: {
        tokenHash: hashed,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      const error: any = new Error("Invalid or expired email verification token.");
      error.statusCode = 400;
      throw error;
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { isEmailVerified: true },
    });

    await prisma.emailVerificationToken.delete({
      where: { id: record.id },
    });

    return { message: "Institutional email address verified successfully." };
  }
}
