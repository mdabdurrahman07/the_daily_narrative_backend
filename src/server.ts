import app from "./app";
import config from "./config/dotenv.config";
import { prisma } from "./lib/prisma";

if (config.node_env !== "production") {
  async function main() {
    const port = config.port;
    try {
      await prisma.$connect();
      console.log("DB Connected Successfully");
      app.listen(port, () => {
        console.log(`The Daily Narrative backend server is running on ${port}`);
      });
    } catch (error) {
      console.log("Error starting the server", error);
      await prisma.$disconnect();
      process.exit(1);
    }
  }
  main();
}
