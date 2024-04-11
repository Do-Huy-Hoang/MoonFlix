import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "PerformerMovie",
  mongoose.Schema({
    perMoDescription: {
        type: String,
        required: true
    },
    performer: {
        type: Schema.Types.ObjectId,
        ref: "Performer",
        required: true
      },
  }, modelOptions)
);