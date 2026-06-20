import app from "./app";
import config from "./config/dotenv.config";

if (config.node_env !== "production") {
  async function main() {
    const port = config.port;
    try {
      app.listen(port, () => {
        console.log(`The Daily Narrative backend server is running on ${port}`);
      });
    } catch (error) {
      console.log("Error starting the server", error);
      process.exit(1);
    }
  }
  main();
}
