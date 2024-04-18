import { Request, Response } from "express";
import mongoose from "mongoose";

export async function healthCheck(req: Request, res: Response) {
  const mongodbConnected = mongoose.connection.readyState === 1 ? true : false;

  if (!mongodbConnected) {
    return res.status(500).send({ mongodb: "not Connected" });
  }

  return res.send({ mongodb: "connected" });
}
