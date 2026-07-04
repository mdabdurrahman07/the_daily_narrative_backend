import { prisma } from "../../lib/prisma";
import {
  ICommentPayload,
  ICommentUpdatePayload,
  IModerateComment,
} from "./comment.interface";

const getAuthorCommentFromDB = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      id: authorId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getCommentByPostId = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      postId,
    },
  });
  return result;
};

const createCommentIntoDB = async (
  payload: ICommentPayload,
  authorId: string,
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return result;
};

const updateCommentIntoDB = async (
  commentId: string,
  payload: ICommentUpdatePayload,
  authorId: string,
) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data: payload,
  });

  return result;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
  });

  await prisma.comment.delete({
    where: {
      id: comment.id,
    },
  });

  return null;
};

const updateModerateComment = async (
  commentId: string,
  payload: IModerateComment,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (comment.status === payload.status) {
    throw new Error(
      `Your Provided status (${payload.status}) is already up to date`,
    );
  }

  const result = await prisma.comment.update({
    where: {
      id: comment.id,
    },
    data: payload,
  });
  return result;
};

export const commentService = {
  getAuthorCommentFromDB,
  getCommentByPostId,
  createCommentIntoDB,
  updateCommentIntoDB,
  deleteComment,
  updateModerateComment,
};
