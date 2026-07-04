import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

export const handleCheckoutSession = async (session: Stripe.Checkout.Session) => {
    // const session = event.data.object;
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
        throw new Error("Webhook Failed");
      }

      const stripeSubscription =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);
      // console.log("sub-info", stripeSubscription.items.data[0]);
      const currentPeriodEndInMilliSec =
        await stripeSubscription.items.data[0]?.current_period_end!;

      const currentPeriodEnd = new Date(currentPeriodEndInMilliSec * 1000);

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

}