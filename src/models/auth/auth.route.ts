import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", authController.getMyProfile)

export const authRoute = router;
