import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/stats", authMiddleware(Role.ADMIN), postController.getPostsStats);
router.get(
  "/my-posts",
  authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.getMyPosts,
);
router.get("/:postId", postController.getSinglePost);
router.post(
  "/",
  authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.addPost,
);
router.patch(
  "/:postId",
  authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.updatePost,
);
router.delete(
  "/:postId",
  authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.deletePost,
);

export const postRoute = router;
