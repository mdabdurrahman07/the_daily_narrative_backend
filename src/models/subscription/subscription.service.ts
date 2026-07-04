import config from "../../config/dotenv.config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutSession } from "./subscription.handler";

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
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    case "customer.subscription.deleted":
      break;
    default:
      // Unexpected event type
      console.log(`No Events matched  Unhandled event type ${event.type}.`);
      break;
  }
};

export const subsService = {
  createCheckoutSessionService,
  handleWebHookService,
};
