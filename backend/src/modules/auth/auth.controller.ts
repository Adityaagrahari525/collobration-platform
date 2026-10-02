import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "../../validators/auth.validator";
import { verifyRefreshToken } from "../../utils/jwt";

const isProduction = process.env.NODE_ENV === "production";

const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax" | "strict",
  path: "/",
  maxAge,
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax" | "strict",
  path: "/",
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedInput);

      // Set Tokens in Secure HttpOnly Cookies
      res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
      res.cookie("accessToken", result.accessToken, getCookieOptions(15 * 60 * 1000));

      return res.status(201).json({
        success: true,
        data: {
          user: result.user,
          verificationDevToken: result.verificationDevToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedInput);

      // Set Tokens in Secure HttpOnly Cookies
      res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
      res.cookie("accessToken", result.accessToken, getCookieOptions(15 * 60 * 1000));

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const user = await AuthService.getCurrentUser(req.user.userId);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token is missing.",
        });
      }

      const result = await AuthService.refresh(refreshToken);

      res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
      res.cookie("accessToken", result.accessToken, getCookieOptions(15 * 60 * 1000));

      return res.status(200).json({
        success: true,
        data: {
          message: "Token refreshed successfully.",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      let userId = req.user?.userId;

      if (!userId && refreshToken) {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded) userId = decoded.userId;
      }

      if (userId) {
        await AuthService.logout(userId, refreshToken);
      }

      res.clearCookie("accessToken", getClearCookieOptions());
      res.clearCookie("refreshToken", getClearCookieOptions());

      return res.status(200).json({
        success: true,
        data: { message: "Signed out successfully." },
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return res.status(400).json({
          success: false,
          message: "Verification token is required.",
        });
      }

      const result = await AuthService.verifyEmail(token);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
