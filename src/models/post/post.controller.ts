import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../util/sendResponse";

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await postService.fetchAllPostsFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts retrieved successfully",
      data: posts,
    });
  },
);
const getPostsStats = () => {};
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const result = await postService.fetchMyPostFromDB(authorId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My pots retrieved successfully",
      data: result,
    });
  },
);
const getSinglePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string;
    if (!postId) {
      throw new Error("Post id is required");
    }

    const result = await postService.fetchSinglePostFromDB(postId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post retrieved successfully",
      data: result,
    });
  },
);
const addPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id as string;
    const payload = req.body;

    const result = await postService.createPostInDB(payload, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created Successfully",
      data: {
        result,
      },
    });
  },
);
const updatePost = () => {};
const deletePost = () => {};

export const postController = {
  getAllPosts,
  getPostsStats,
  getMyPosts,
  getSinglePost,
  addPost,
  updatePost,
  deletePost,
};
