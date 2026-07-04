import { Router } from "express";
import { premiumController } from "./premium.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", authMiddleware(Role.ADMIN, Role.AUTHOR, Role.USER), premiumController.getPremiumContent)

export const premiumRoute = router;
