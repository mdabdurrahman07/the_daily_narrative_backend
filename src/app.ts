import express, { Application, Request, Response } from "express";
const app: Application = express();

// root
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to The Daily Narrative REST API Server",
    author: "MD Abdur Rahman Nur Jamil",
    error: false,
  });
});
export default app;
