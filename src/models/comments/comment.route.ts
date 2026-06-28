import { Role } from './../../../generated/prisma/enums';
import { Router } from "express";
import { commentController } from "./comment.controller";
import authMiddleware from "../../middleware/auth.middleware";


const router = Router();
router.get("/author/:authorId", commentController.fetchAuthorComment)
router.get("/:commentId", commentController.fetchSingleComment);
router.post("/", authMiddleware(Role.USER, Role.AUTHOR, Role.ADMIN) ,commentController.addComment);
// router.patch("/:commentId");
// router.delete("/:commentId");
// router.patch("/:commentId/moderate");

export const commentRoute = router;
