import { PassThrough } from "node:stream";
import { prisma } from "../../lib/prisma";
import { ICommentPayload } from "./comment.interface";

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

const getSingleComment = async (commentId: string) => {
  const result = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    include: {
      post: {
        omit: {
          authorId: true,
          content: true,
          createdAt: true,
          isFeatured: true,
          status: true,
          updatedAt: true,
          tags: true,
          thumbnail: true,
        },
      },
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

export const commentService = {
  getAuthorCommentFromDB,
  getSingleComment,
  createCommentIntoDB,
};
