import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

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
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },

  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  // return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });
  return transactionResult;
};

const fetchMyPostFromDB = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};

const updatePostIntoDB = async (
  postId: string,
  authorId: string,
  payload: IUpdatePostPayload,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You're not the owner of this post");
  }
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
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

const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You're not the owner of this post");
  }
  // ! no need a result and return here
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const fetchPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const totalPost = await tx.post.count();

    const totalPublishedPosts = await tx.post.count({
      where: {
        status: PostStatus.PUBLISHED,
      },
    });
    const totalDraftPosts = await tx.post.count({
      where: {
        status: PostStatus.DRAFT,
      },
    });
    const totalArchivePosts = await tx.post.count({
      where: {
        status: PostStatus.ARCHIVE,
      },
    });

    const totalComments = await tx.comment.count();

    const totalApprovedComments = await tx.comment.count({
      where: {
        status: CommentStatus.APPROVED,
      },
    });
    const totalRejectComments = await tx.comment.count({
      where: {
        status: CommentStatus.REJECT,
      },
    });

    const totalPostViewsAgrt = await tx.post.aggregate({
      _sum: {
        views: true,
      },
    });

    const totalPostViews = totalPostViewsAgrt._sum.views

    return {
      totalPost,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivePosts,
      totalComments,
      totalApprovedComments,
      totalRejectComments,
      totalPostViews
    };
  });
  return transactionResult;
};

export const postService = {
  createPostInDB,
  fetchAllPostsFromDB,
  fetchSinglePostFromDB,
  fetchMyPostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  fetchPostsStats,
};
