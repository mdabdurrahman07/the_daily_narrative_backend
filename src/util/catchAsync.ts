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
          message: (error as Error).message,
          error: true,
        });
      } else {
        throw new Error("Unexpected catchAsync func error");
      }
    }
  };
};

export default catchAsync;
