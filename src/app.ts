import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config/dotenv.config";
const app: Application = express();

// express middlewares
app.use(express.json)
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
   origin: config.app_url,
   credentials: true
}))

// root
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to The Daily Narrative REST API Server",
    author: "MD Abdur Rahman Nur Jamil",
    error: false,
  });
});
export default app;
