import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostInDB = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const fetchAllPostsFromDB = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

const fetchSinglePostFromDB = async (postId: string) => {
  const result = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  const updatePost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return updatePost;
};

export const postService = {
  createPostInDB,
  fetchAllPostsFromDB,
  fetchSinglePostFromDB,
};
