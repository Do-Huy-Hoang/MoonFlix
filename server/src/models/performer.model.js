import mongoose from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Performer",
  mongoose.Schema({
    perName: {
      type: String,
      required: true
    },
    perYear: {
        type: Number,
        required: true
    },
    perAvatar: {
        type: String,
        required: true
    },
  }, modelOptions)
);