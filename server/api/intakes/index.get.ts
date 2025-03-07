import { ConnectDB } from "~/utils/db";
import IntakeModel from "~~/server/models/intake.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const apps = await IntakeModel.find(query);
  return apps;
});
