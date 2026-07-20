import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err?.cause?.statusCode || err?.statusCode || 500;
  let message = "Internal Server Error";
  let errors: { field?: string; message?: string }[] = [];

  // zod validation error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else if (err instanceof Error) {
    message = err.name;
    errors = err?.message?.split(",").map((message) => ({ message }));

    if (err.name === "CastError") {
      statusCode = 400;
      message = "Validation Error";
      const field = (err as any).path;
      errors = [
        {
          field,
          message: `Invalid value for field ${field}`,
        },
      ];
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
