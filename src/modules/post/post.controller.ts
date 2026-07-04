import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../util/sendResponse";

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const posts = await postService.fetchAllPostsFromDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts retrieved successfully",
      data: posts.data,
      meta: posts.meta,
    });
  },
);
const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.fetchPostsStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts stats retrieved successfully",
      data: result,
    });
  },
);
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
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId as string;
    if (!postId) {
      throw new Error("PostId is required in params");
    }
    const payload = req.body;

    const result = await postService.updatePostIntoDB(
      postId,
      authorId,
      payload,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Updated Successfully",
      data: result,
    });
  },
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId as string;
    if (!postId) {
      throw new Error("PostId is required in params");
    }
    // ! no need a result and return here
    await postService.deletePostFromDB(postId, authorId, isAdmin);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post deleted successfully",
      data: null,
    });
  },
);

export const postController = {
  getAllPosts,
  getPostsStats,
  getMyPosts,
  getSinglePost,
  addPost,
  updatePost,
  deletePost,
};
