import { error } from "node:console";
import config from "../../config/dotenv.config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import {
  handleChangeSubscription,
  handleCheckoutSession,
} from "./subscription.handler";

const createCheckoutSessionService = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    // trying from db to take the id
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // create stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
    }
    // create stripe checkoutSession
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });
    return session.url;
  });
  return {
    payment_url: transactionResult,
  };
};

const handleWebHookService = async (payload: Buffer, signature: string) => {
  console.log("================================");
console.log("Webhook received");
console.log(signature);
console.log(payload)
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Occurs when a Checkout Session has been successfully completed.

      await handleCheckoutSession(event.data.object);

      break;
    case "customer.subscription.updated":
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      await handleChangeSubscription(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleChangeSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`No Events matched  Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      userId
    },
  });
  if(!isSubscriptionExist){
    throw new Error("No Subscription Found")
  }
  const isActive =
    isSubscriptionExist.status === "ACTIVE" &&
    isSubscriptionExist.currentPeriodEnd &&
    new Date(isSubscriptionExist.currentPeriodEnd) > new Date();
  return {
    status: isSubscriptionExist.status,
    isSubscribed: isActive,
    currentPeriodEnd: isSubscriptionExist.currentPeriodEnd,
  };
};

export const subsService = {
  createCheckoutSessionService,
  handleWebHookService,
  getSubscriptionStatus
};
