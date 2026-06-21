import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = await authService.createUserIntoDB(body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "user created successfully",
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "failed to register an user",
        error: (error as Error).message,
      });
    } else {
      console.log("unexpected error at register user");
    }
  }
};

export const authController = {
  registerUser,
};
