import { NextFunction, Request, Response } from "express";
import catchAsync from "../../util/catchAsync";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const subsController = {
  createCheckoutSession,
};
