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
    const { accessToken, refreshToken } = await authService.loginUser(payload);
    // ? response cookie setup

    // ! accessToken - cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24  // 1day
    })
    // ! refreshToken - cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24  * 7 // 7day
    })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Login Successful",
      data: { accessToken, refreshToken },
    });
  },
);

export const authController = {
  registerUser,
  loginUser,
};
