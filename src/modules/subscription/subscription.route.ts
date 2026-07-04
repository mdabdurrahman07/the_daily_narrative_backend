import { Router } from "express";
import { subsController } from "./subscription.controller";

import { Role } from "../../../generated/prisma/enums";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/checkout",
  authMiddleware(Role.ADMIN, Role.AUTHOR, Role.USER),
  subsController.createCheckoutSession,
);

router.post("/webhook", subsController.handleWebHook);

router.get(
  "/status",
  authMiddleware(Role.ADMIN, Role.AUTHOR, Role.USER),
  subsController.getSubsStatus,
);

export const subsRoute = router;
