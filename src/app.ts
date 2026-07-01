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

const app: Application = express();


// stripe webhook

app.post("/api/v1/tdn/subscription/webhook", express.raw({type: 'application/json'}) , () => {
  
})

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
