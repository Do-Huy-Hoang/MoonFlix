import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

  export default mongoose.model(
  "Movie",
  mongoose.Schema({
    mediaType: {
      type: String,
      enum: ["tv", "movie"],
      required: true
    },
    mediaTitle: {
      type: String,
      required: true
    },
    mediaDecription: {
        type: String,
        required: true
      },
      mediaRate: {
      type: Number,
      required: true
    },
    mediaYear: {
      type: Number,
      required: true
    },
    mediaOfViewmediaRate: {
      type: Number,
      required: false
    },
    mediaLinkPoster: {
      type: String,
      required: true
    },
    mediaLinkTrailer: {
      type: String,
      required: true
    },
    mediaLinkEnbale: {
        type: String,
        required: false,
    },
    episodes: [{
      title: {
        type: String,
        required: true
      },
      episodeNumber: {
        type: Number,
        required: true
      },
      mediaLinkEnbale: {
        type: String,
        default: ""
      },
    }],

    genres: [{
      type: Schema.Types.ObjectId,
      ref: 'Genre'
    }],
    performer: [{
      type: Schema.Types.ObjectId,
      ref: 'PerformerMovie'
    }]
  }, modelOptions)
);