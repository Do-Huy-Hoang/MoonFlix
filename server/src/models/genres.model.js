import mongoose from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Genres",
  mongoose.Schema({
    genresTitle: {
      type: String,
      required: true
    },
  }, modelOptions)
);