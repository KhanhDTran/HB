import mongoose from "mongoose";
const { Schema } = mongoose;

const resultSchema = new Schema(
  {
    record: { type: Schema.Types.ObjectId, ref: "Record" },
    result: String,
    resultHtml: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Result", resultSchema);
