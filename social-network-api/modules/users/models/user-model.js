'use strict';

import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  gender: { type: String, default: null },
  date_of_birth: { type: Date, default: null },
  avatar_url: { type: String, default: null },
  friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  is_activated: { type: Boolean, default: false },
  activate_code: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null }
}, { versionKey: false });

UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ activate_code: 1 });

mongoose.model("User", UserSchema);