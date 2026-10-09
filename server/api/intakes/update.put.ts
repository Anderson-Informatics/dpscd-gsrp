import mongoose from "mongoose";
import { ConnectDB } from "~/utils/db";
import IntakeModel from "~~/server/models/intake.model";
import { requireApiKey } from "~~/server/utils/auth";

const UPDATABLE_FIELDS = [
  "Status",
  "Notes",
  "Teacher",
  "Classroom",
  "ContactDate",
  "ContactComments",
] as const;

export default defineEventHandler(async (event) => {
  requireApiKey(event);

  const body = await readBody(event);

  if (!Array.isArray(body) || body.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request body must be a non-empty array of intake updates",
    });
  }

  const invalidIds: unknown[] = [];
  const operations: mongoose.AnyBulkWriteOperation[] = [];

  for (const doc of body) {
    const id = doc?._id;
    if (!id || !mongoose.isValidObjectId(id)) {
      invalidIds.push(id ?? null);
      continue;
    }

    const $set: Record<string, unknown> = {};
    for (const field of UPDATABLE_FIELDS) {
      if (field in doc) {
        $set[field] = doc[field];
      }
    }

    if (Object.keys($set).length === 0) {
      continue;
    }

    operations.push({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(id) },
        update: { $set },
        upsert: false,
      },
    });
  }

  if (operations.length === 0) {
    return { matchedCount: 0, modifiedCount: 0, invalidIds };
  }

  await ConnectDB();
  const result = await IntakeModel.bulkWrite(operations);

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    invalidIds,
  };
});
