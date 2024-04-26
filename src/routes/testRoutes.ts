import { Request, Response, Router } from "express";

export const testApis = Router();

testApis.get("/", async (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

testApis.post("/email", async (req: Request, res: Response) => {
  res.send({ message: "ok" });
});
