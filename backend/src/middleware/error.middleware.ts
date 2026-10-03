import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Validation Error: ${errorMessages}`,
      },
      requestId: req.id,
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
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message,
    },
    requestId: req.id,
  });
};
