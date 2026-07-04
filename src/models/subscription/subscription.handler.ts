import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

const getPeriodEnd = (payload: Stripe.Subscription) => {
  const currentPeriodEndInMilliSec = payload.items.data[0]?.current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodEndInMilliSec * 1000);

  return currentPeriodEnd;
};

export const handleCheckoutSession = async (
  session: Stripe.Checkout.Session,
) => {
  // const session = event.data.object;
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log("Webhook: Missing values for creating session");
    return;
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);
  // // console.log("sub-info", stripeSubscription.items.data[0]);
  // const currentPeriodEndInMilliSec =
  //   await stripeSubscription.items.data[0]?.current_period_end!;

  const currentPeriodEnd = getPeriodEnd(stripeSubscription);

  // updating or inserting prisma subscription model

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};

export const handleChangeSubscription = async (
  payload: Stripe.Subscription,
) => {
  const stripeSubscriptionId = payload.id;
  const subsStatus =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELED
        : SubscriptionStatus.EXPIRED;
  const currentPeriodEnd = getPeriodEnd(payload);
  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId,
    },
  });
  if (!isSubscriptionExist) {
    console.log(
      `Webhook: No Subscription found for this is id = ${stripeSubscriptionId}`,
    );
    return;
  }
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      subsStatus,
      currentPeriodEnd,
    },
  });
};
