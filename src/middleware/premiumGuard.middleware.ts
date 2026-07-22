import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/enums";

export const subscriptionGuard = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId
      },
    });
    if (!subscription) {
      throw new Error(
        "You don't have any subscription, get a subscription to access premium content",
      );
    }
    if (subscription?.status !== SubscriptionStatus.ACTIVE) {
      throw new Error(
        "You're not an active subscriber, update your subscription to get access to premium content",
      );
    }
    next()
  });
};
