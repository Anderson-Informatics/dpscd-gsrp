import crypto from "node:crypto";
import type { H3Event } from "h3";

export function requireApiKey(event: H3Event) {
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
}
