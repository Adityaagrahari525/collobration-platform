import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(", ");
    return res.status(400).json({
      success: false,
      message: `Validation Error: ${message}`,
    });
  }

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const message =
    isProduction && statusCode === 500
      ? "An internal server error occurred."
      : err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
