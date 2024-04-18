import mongoose from "mongoose";
import config from "config";

export const connect = async () => {
  const dbName = config.get("mongodb.dbName");
  const host = config.get("mongodb.host");
  const serviceName = config.get<string>("serviceName");
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (!username || !password) {
    throw new Error("Username and password not provided");
  }

  const mongoUrl = `mongodb+srv://${username}:${password}@${host}/${dbName}`;
  console.log(`connecting to MongoDb: ${host}`);

  await mongoose.connect(mongoUrl, {
    readPreference: "primary",
    connectTimeoutMS: 30000,
    socketTimeoutMS: 20000,
    appName: serviceName,
  });

  console.log(`Connected to MongoDB: ${host}`);
};
