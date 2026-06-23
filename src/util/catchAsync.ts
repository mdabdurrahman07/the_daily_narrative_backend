import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to Register an User",
          error: (error as Error).message,
        });
      } else {
        console.log("Unexpected Error at Register User");
      }
    }
  };
};

export default catchAsync;
