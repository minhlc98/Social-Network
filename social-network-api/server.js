import 'dotenv/config';
import mongoose from "./libs/mongoose.js";
import express from "./libs/express.js";
import { logError } from './modules/core/libs/errors.lib.js';

(async () => {
  try {
    const db = await mongoose.connect();
    await mongoose.loadModels();
    await express.init(db);
  } catch (error) {
    logError(error);
  }
})();