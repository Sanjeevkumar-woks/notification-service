import app from "./app";
import * as mongodb from "./connectors/mongodb";
import { connectToRedis } from "./connectors/redis";
import { runWorkers } from "./workers";

async function bootstrap() {
  const SERVICE_PORT = process.env.SERVICE_PORT;

  try {
    await mongodb.connect();
    await connectToRedis();

    app.listen(SERVICE_PORT, () => {
      console.log(`HTTP Server is RUnning on Port: ${SERVICE_PORT}`);
    });
    await runWorkers();
  } catch (err) {
    console.log(`Error While connection MongoDB ${err}`);
    process.exit(1);
  }
}

bootstrap();
