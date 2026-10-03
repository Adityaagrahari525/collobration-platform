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
import { OAuth2Client } from "google-auth-library";
import { config } from "../../config";
import { Role } from "@prisma/client";
import { AuditService } from "../audit/audit.service";

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

  static getGoogleAuthUrl(state: string): string {
    if (!config.googleClientId || !config.googleClientSecret) {
      throw new Error("GOOGLE_CONFIG_MISSING");
    }

    const oauth2Client = new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret,
      config.googleCallbackUrl
    );

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      state,
      prompt: "select_account",
    });
  }

  static async handleGoogleCallback(code: string, requestId: string) {
    if (!config.googleClientId || !config.googleClientSecret) {
      const err: any = new Error("Google OAuth configuration is missing on server.");
      err.code = "google_configuration_missing";
      throw err;
    }

    const oauth2Client = new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret,
      config.googleCallbackUrl
    );

    // Exchange authorization code for tokens
    let tokens;
    try {
      const res = await oauth2Client.getToken(code);
      tokens = res.tokens;
    } catch (tokenErr: any) {
      console.error("[AuthService] Google token exchange failed:", tokenErr?.message || tokenErr);
      const err: any = new Error("Failed to exchange authorization code with Google.");
      err.code = tokenErr?.message?.includes("invalid_grant") ? "invalid_grant" : "invalid_token";
      throw err;
    }

    if (!tokens.id_token) {
      const err: any = new Error("Google ID token missing from response.");
      err.code = "invalid_token";
      throw err;
    }

    // Verify Google ID Token cryptographically
    let ticket;
    try {
      ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.googleClientId,
      });
    } catch (verifyErr: any) {
      console.error("[AuthService] Google ID token verification failed:", verifyErr?.message || verifyErr);
      const err: any = new Error("Invalid or unverified Google identity token.");
      err.code = "invalid_token";
      throw err;
    }

    const payload = ticket.getPayload();
    if (!payload) {
      const err: any = new Error("Failed to extract Google user payload.");
      err.code = "invalid_token";
      throw err;
    }

    // Verify OpenID claims
    const issuer = payload.iss;
    if (issuer !== "accounts.google.com" && issuer !== "https://accounts.google.com") {
      const err: any = new Error("Untrusted Google token issuer.");
      err.code = "wrong_issuer";
      throw err;
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const err: any = new Error("Expired Google authentication token.");
      err.code = "expired_token";
      throw err;
    }

    if (payload.aud !== config.googleClientId) {
      const err: any = new Error("Audience mismatch on Google identity token.");
      err.code = "wrong_audience";
      throw err;
    }

    if (!payload.email_verified || !payload.email) {
      const err: any = new Error("Institutional Google account email is not verified.");
      err.code = "email_not_verified";
      throw err;
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase().trim();
    const emailDomain = email.split("@")[1];

    if (!emailDomain) {
      const err: any = new Error("Invalid email format in Google account.");
      err.code = "unsupported_institution";
      throw err;
    }

    // Resolve Institution from verified email domain
    let institution = await prisma.institution.findFirst({
      where: {
        emailDomain: { equals: emailDomain, mode: "insensitive" },
      },
    });

    if (!institution) {
      const allInstitutions = await prisma.institution.findMany();
      institution = allInstitutions.find((inst) => {
        const instDomain = inst.emailDomain.toLowerCase();
        return emailDomain === instDomain || emailDomain.endsWith("." + instDomain);
      }) || null;
    }

    if (!institution) {
      await AuditService.log({
        requestId,
        action: "GOOGLE_LOGIN_REJECTED",
        entityType: "USER",
        metadata: { reason: "unsupported_institution", emailDomain },
      });
      const err: any = new Error(`Domain @${emailDomain} is not an accredited institution in the consortium.`);
      err.code = "unsupported_institution";
      throw err;
    }

    // Account Resolution & Linking
    // 1. Check if user already exists by googleId
    let user = await prisma.user.findUnique({
      where: { googleId },
      include: { institution: true, profile: true },
    });

    if (user) {
      if (!user.isActive) {
        const err: any = new Error("User account is inactive.");
        err.code = "account_deactivated";
        throw err;
      }

      if (!user.isEmailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true },
        });
        user.isEmailVerified = true;
      }
    } else {
      // 2. Check if user exists by institutional email
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
        include: { institution: true, profile: true },
      });

      if (existingByEmail) {
        // Safe duplicate / conflict check
        if (existingByEmail.googleId && existingByEmail.googleId !== googleId) {
          await AuditService.log({
            requestId,
            actorId: existingByEmail.id,
            action: "GOOGLE_ACCOUNT_CONFLICT",
            entityType: "USER",
            entityId: existingByEmail.id,
            metadata: { email, reason: "different_google_id_already_linked" },
          });
          const err: any = new Error("This institutional email is already associated with a different Google identity.");
          err.code = "account_link_conflict";
          throw err;
        }

        // Link verified Google identity to existing user
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            googleId,
            isEmailVerified: true,
          },
          include: { institution: true, profile: true },
        });

        await AuditService.log({
          requestId,
          actorId: user.id,
          action: "GOOGLE_ACCOUNT_LINKED",
          entityType: "USER",
          entityId: user.id,
          metadata: { email: user.email },
        });
      } else {
        // 3. New user registration
        const firstName = payload.given_name || payload.name?.split(" ")[0] || "Scholar";
        const lastName = payload.family_name || (payload.name ? payload.name.split(" ").slice(1).join(" ") : "") || "Student";
        const passwordHash = await hashPassword(crypto.randomBytes(32).toString("hex"));

        user = await prisma.user.create({
          data: {
            email,
            googleId,
            passwordHash,
            firstName,
            lastName,
            role: Role.STUDENT,
            institutionId: institution.id,
            isEmailVerified: true,
            isActive: true,
            profile: {
              create: {
                department: "General Academic Roster",
                academicYear: "Enrolled Scholar",
                bio: `Student researcher at ${institution.name}`,
                avatarUrl: payload.picture || "",
              },
            },
          },
          include: { institution: true, profile: true },
        });

        await AuditService.log({
          requestId,
          actorId: user.id,
          action: "GOOGLE_USER_CREATED",
          entityType: "USER",
          entityId: user.id,
          metadata: { email: user.email, institutionId: institution.id },
        });
      }
    }

    // Issue existing CampusLink JWT
    const payloadTokens = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payloadTokens);
    const refreshToken = generateRefreshToken(payloadTokens);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await AuditService.log({
      requestId,
      actorId: user.id,
      action: "GOOGLE_LOGIN_SUCCESS",
      entityType: "USER",
      entityId: user.id,
      metadata: { email: user.email },
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
}
