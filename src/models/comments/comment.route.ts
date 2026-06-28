import { Router } from "express";

const router = Router();

router.get("author/:authorId")
router.get("/:commentId");
router.post("/");
router.patch("/:commentId");
router.delete("/:commentId");
router.patch("/:commentId/moderate");

export const commentRoute = router;
