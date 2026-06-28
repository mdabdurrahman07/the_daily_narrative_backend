import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { commentService } from "./comment.service";

const fetchAuthorComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {authorId} = req.params
    const result = await commentService.getAuthorCommentFromDB(authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments retrieved successfully",
      data: result,
    });
  },
);

const fetchSingleComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const result = await commentService.getSingleComment(commentId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single comment retrieved successfully",
      data: result,
    });
  },
);

const addComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req.user?.id as string
    const result = await commentService.createCommentIntoDB(payload, authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created",
      data: result,
    });
  },
);

export const commentController = {
  fetchAuthorComment,
  fetchSingleComment,
  addComment,
};
