import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    mood: {
      type: String,
      enum: ["happy", "calm", "excited", "grateful", "anxious", "sad", "neutral"],
      default: "neutral",
    },
    sentiment: { type: String, enum: ["positive", "negative", "neutral"], default: "neutral" },
    emotions: [{ type: String }],
    aiInsight: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Entry", entrySchema);
