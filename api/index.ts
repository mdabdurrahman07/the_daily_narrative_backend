import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

let cachedHandler: ReturnType<typeof serverless> | null = null;

async function getHandler() {
  if (!cachedHandler) {
    await prisma.$connect();
    cachedHandler = serverless(app);
  }

  return cachedHandler;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const serverlessHandler = await getHandler();
  return serverlessHandler(req, res);
}
