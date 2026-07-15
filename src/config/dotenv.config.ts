import dotenv from "dotenv";
import path from "node:path";
import { env } from "node:process";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
  quiet: true,
});

const config = {
  database_url: env.DATABASE_URL as string,
  node_env: env.NODE_ENV as string,
  port: env.PORT as string,
  app_url: env.APP_URL as string,
  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS as string,
  jwt_access_secret: env.JWT_ACCESS_SECRET! as string,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET! as string,
  jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN! as string,
  jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN! as string,
  stripe_secret_key: env.STRIPE_SECRET_KEY! as string,
  stripe_price_id: env.STRIPE_PRICE_ID! as string,
  stripe_webhook_secret: env.STRIPE_WEBHOOK_SECRET_KEY! as string
};

export default config;
