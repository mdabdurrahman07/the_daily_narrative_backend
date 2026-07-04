import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { commentService } from "./comment.service";

const fetchAuthorComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorId } = req.params;
    const result = await commentService.getAuthorCommentFromDB(
      authorId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments retrieved successfully",
      data: result,
    });
  },
);

const fetchCommentByPostId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string;
    const result = await commentService.getCommentByPostId(postId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment by postId retrieved successfully",
      data: result,
    });
  },
);

const addComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req.user?.id as string;
    const result = await commentService.createCommentIntoDB(payload, authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created",
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { commentId } = req.params;
    const authorId = user?.id as string;
    const payload = req.body;

    const result = await commentService.updateCommentIntoDB(
      commentId as string,
      payload,
      authorId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully",
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const authorId = req.user?.id as string;

    await commentService.deleteComment(commentId as string, authorId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment deleted",
    });
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    const payload = req.body;

    const result = await commentService.updateModerateComment(
      commentId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated by an admin",
      data: {},
    });

    return result;
  },
);

export const commentController = {
  fetchAuthorComment,
  fetchCommentByPostId,
  addComment,
  updateComment,
  deleteComment,
  moderateComment,
};
