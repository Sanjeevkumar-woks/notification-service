import IORedis from "ioredis";

let redisClient: IORedis;

export const connectToRedis = async () => {
  console.log(`connecting to redis ${process.env.REDIS_HOST}`);

  if (!redisClient) {
    redisClient = new IORedis({
      maxRetriesPerRequest: null,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_TLS_DISABLED ? undefined : {},
    });
    redisClient.on("connect", () => {
      console.info("connected to redis");
    });

    redisClient.on("error", (err) => {
      redisClient.disconnect();
    });
  }

  try {
    await redisClient.ping();
  } catch (err) {
    redisClient.disconnect();
    throw new Error("Error Connecting to Redis");
  }
  return redisClient;
};

export const getRedisClient = () => {
  return redisClient;
};
