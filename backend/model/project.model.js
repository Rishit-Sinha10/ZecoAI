import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, default: "" },
  isMain: { type: Boolean, default: false },
}, { _id: true, timestamps: true });

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  files: [fileSchema],
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
