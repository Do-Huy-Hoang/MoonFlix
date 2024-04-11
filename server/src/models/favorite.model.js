import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Favorite",
  mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
    },
  }, modelOptions)
);