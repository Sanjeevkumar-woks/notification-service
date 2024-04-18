import app from "./app";
import * as mongodb from "./connectors/mongodb";

async function bootstrap() {
  const SERVICE_PORT = process.env.SERVICE_PORT;

  try {
    await mongodb.connect();

    app.listen(SERVICE_PORT, () => {
      console.log(`HTTP Server is RUnning on Port: ${SERVICE_PORT}`);
    });
  } catch (err) {
    console.log(`Error While connection MongoDB ${err}`);
    process.exit(1);
  }
}

bootstrap();
