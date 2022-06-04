import 'dotenv/config';
import mongoose from "./libs/mongoose.js";
import express from "./libs/express.js";

(async () => {
  const db = await mongoose.connect();
  await mongoose.loadModels();
  await express.init(db);
})();