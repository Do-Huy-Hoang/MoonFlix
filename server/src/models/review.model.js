import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Review",
  mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    user_name: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
    },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
  }, modelOptions)
);