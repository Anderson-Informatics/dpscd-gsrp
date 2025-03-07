import { Nitro } from "nitropack";
import mongoose from "mongoose";

export default async (_nitroApp: Nitro) => {
  //run your connect code here
  const config = useRuntimeConfig();
  //connect to mongodb
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
};
