import mongoose from "mongoose";

const codeRunSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  stdin: { type: String, default: "" },
  output: { type: String, default: "" },
  error: { type: String, default: "" },
  exitCode: { type: Number, default: null },
  executionTime: { type: String, default: null },
  memory: { type: Number, default: null },
}, { timestamps: true });

export default mongoose.model("CodeRun", codeRunSchema);
