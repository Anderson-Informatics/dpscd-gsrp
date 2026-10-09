import { ConnectDB } from "~/utils/db";
import IntakeModel from "~~/server/models/intake.model";
import { requireApiKey } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireApiKey(event);

  const query = getQuery(event);
  await ConnectDB();
  const apps = await IntakeModel.find(query);
  return apps;
});
