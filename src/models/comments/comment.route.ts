import { Role } from './../../../generated/prisma/enums';
import { Router } from "express";
import { commentController } from "./comment.controller";
import authMiddleware from "../../middleware/auth.middleware";


const router = Router();
router.get("/author/:authorId", commentController.fetchAuthorComment)
router.get("/:commentId", commentController.fetchSingleComment);
router.post("/", authMiddleware(Role.USER, Role.AUTHOR, Role.ADMIN) ,commentController.addComment);
router.patch("/:commentId", authMiddleware(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.updateComment);
router.delete("/:commentId", authMiddleware(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.deleteComment);
router.patch("/:commentId/moderate", authMiddleware(Role.ADMIN), commentController.moderateComment);

export const commentRoute = router;
