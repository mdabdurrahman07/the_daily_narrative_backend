import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICommentPayload {
  content: string;
  postId: string;
}
export interface ICommentUpdatePayload {
  content?: string;
  status?: CommentStatus;
}

export interface IModerateComment {
  status?: CommentStatus;
}
