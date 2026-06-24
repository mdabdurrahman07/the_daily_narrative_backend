import { Router } from "express";
import { authController } from "./auth.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", authMiddleware(Role.USER, Role.ADMIN, Role.AUTHOR) , authController.getMyProfile)

export const authRoute = router;
