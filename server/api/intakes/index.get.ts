import crypto from "node:crypto";
import { ConnectDB } from "~/utils/db";
import IntakeModel from "~~/server/models/intake.model";

export default defineEventHandler(async (event) => {
  const providedKey = getHeader(event, "x-api-key") ?? "";
  const expectedKey = useRuntimeConfig().INTAKES_KEY;

  if (!providedKey || !expectedKey) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  if (providedKey.length !== expectedKey.length) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const providedBuffer = Buffer.from(providedKey);
  const expectedBuffer = Buffer.from(expectedKey);

  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const query = getQuery(event);
  await ConnectDB();
  const apps = await IntakeModel.find(query);
  return apps;
});
