import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config/dotenv.config";
import { authRoute } from "./models/auth/auth.route";
import { postRoute } from "./models/post/post.route";
import { commentRoute } from "./models/comments/comment.route";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { subsRoute } from "./models/subscription/subscription.route";
import { stripe } from "./lib/stripe";

const app: Application = express();

// stripe wh_sec
// const endpointSecret = config.stripe_webhook_secret;

// stripe webhook
// app.post(
//   "/api/v1/tdn/subscription/webhook",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     let event = request.body;

//     console.log("webhook event", event);
//     console.log("webhook request header", request.headers);
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers["stripe-signature"]!;
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           endpointSecret,
//         );
//       } catch (err: any) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response.sendStatus(400);
//       }
//     }

//     console.log("event after try-block", event);

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         console.log(
//           `PaymentIntent for ${paymentIntent.amount} was successful!`,
//         );
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case "payment_method.attached":
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   },
// );

app.use("/api/v1/tdn/subscription/webhook" ,express.raw({type: "application/json"}))

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// root
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to The Daily Narrative REST API Server",
    author: "MD Abdur Rahman Nur Jamil",
    error: false,
  });
});

// routing

// ! USERS
app.use("/api/v1/tdn/auth/users", authRoute);

// ! POSTS
app.use("/api/v1/tdn/posts", postRoute);

// ! COMMENTS
app.use("/api/v1/tdn/comments", commentRoute);

// ! Stripe Subscription
app.use("/api/v1/tdn/subscription", subsRoute);

// ! wrong route error
app.use(notFound);

// ! Global Error
app.use(globalErrorHandler);

export default app;
