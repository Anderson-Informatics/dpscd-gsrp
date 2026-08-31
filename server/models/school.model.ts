import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {},
  { strict: false }
);

export default mongoose.model("School", schema, "schools");
