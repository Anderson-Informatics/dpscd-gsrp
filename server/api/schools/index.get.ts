import { ConnectDB } from "~/utils/db";
import SchoolModel from "~~/server/models/school.model";
import { requireApiKey } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireApiKey(event);

  const query = getQuery(event);
  await ConnectDB();
  const schools = await SchoolModel.find(query);
  return schools;
});
