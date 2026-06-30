import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode;
  let errorMessage = (err as Error).message || "Internal Server Error";
  let errorName = (err as Error).name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields ";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      ((statusCode = httpStatus.UNAUTHORIZED),
        (errorMessage =
          "Authentication failed against database server. Please check your credentials"));
    } else if (err.errorCode === "P1001") {
      ((statusCode = httpStatus.BAD_REQUEST),
        (errorMessage = "Can't reach database server"));
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    ((statusCode = httpStatus.INTERNAL_SERVER_ERROR),
      (errorMessage = "Error Occurred during query execution"));
  }
  res.status(statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    name: errorName,
    message: errorMessage,
    error: (err as Error).stack,
  });
};
