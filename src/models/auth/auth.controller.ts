import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import catchAsync from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await authService.createUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Registered Successfully",
      data: { user },
    });
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const loginResult = await authService.loginUser(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Login Successful",
      data: loginResult,
    });
  },
);

export const authController = {
  registerUser,
  loginUser,
};
