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
const getMyPosts = () => {};
const getSinglePost = () => {};
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
