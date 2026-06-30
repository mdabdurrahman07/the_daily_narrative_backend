import { Router } from "express";
import { subsController } from "./subscription.controller";

const router = Router();

router.post("/checkout", subsController.createCheckoutSession);

export const subsRoute = router;
