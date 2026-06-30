import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { subsService } from "./subscription.service";
import { sendResponse } from "../../util/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const result = await subsService.createCheckoutSessionService(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout Successful",
      data: result,
    });
  },
);

export const subsController = {
  createCheckoutSession,
};
