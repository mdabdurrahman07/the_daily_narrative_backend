import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { premiumServices } from "./premium.service";
import { sendResponse } from "../../util/sendResponse";

const getPremiumContent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await premiumServices.getPremiumContentFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Premium Content Retried Successfully",
      data: result,
    });
  },
);

export const premiumController = {
  getPremiumContent,
};
