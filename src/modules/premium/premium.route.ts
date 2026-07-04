import { Router } from "express";
import { premiumController } from "./premium.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";
import { subscriptionGuard } from "../../middleware/premiumGuard.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionGuard(),
  premiumController.getPremiumContent,
);

export const premiumRoute = router;
