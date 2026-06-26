import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/");
router.get("/stats", authMiddleware(Role.ADMIN));
router.get("/my-posts", authMiddleware(Role.ADMIN, Role.AUTHOR));
router.get("/:postId");
router.post("/", authMiddleware(Role.ADMIN, Role.AUTHOR));
router.patch("/:postId", authMiddleware(Role.ADMIN, Role.AUTHOR));
router.delete("/:postId", authMiddleware(Role.ADMIN, Role.AUTHOR));

export const postRoute = router;
