'use strict';

import mongoose from "mongoose";
const { Schema } = mongoose;

const PostSchema = new Schema({
  content: { type: String, required: true },
  images: [String],
  created_by_user: { type: mongoose.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
}, { versionKey: false });

PostSchema.index({ created_at: -1 });
PostSchema.index({ created_by_user: 1, created_at: -1 });

mongoose.model("Post", PostSchema);