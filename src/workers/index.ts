import { startMailWorker } from "./mailWorker";

export async function runWorkers() {
  console.info("Starting worker");
  //await runNotificationWorker();
  await startMailWorker();
  console.info("worker started");
}
