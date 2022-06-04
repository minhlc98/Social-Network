'use strict';

import glob from "glob";
import mongoose from "mongoose";
import moment from "moment";

const connect = async () => {
  try {
    const connection_string = process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/social_network";
    const options = {
      maxPoolSize: 10,
      socketTimeoutMS: 0, // using OS socket timeout
      keepAlive: true
    };

    const now = () => moment().format('DD/MM/YYYY HH:mm:ss SSS');

    mongoose.connection.on("connecting", function() {
      console.log(`[${now()}] connecting to MongoDB`);
    });

    mongoose.connection.on("connected", function() {
      console.log(`[${now()}] connected to MongoDB`);
    });

    mongoose.connection.on("open", function() {
      console.log(`[${now()}] connection opened to MongoDB`);
    });

    mongoose.connection.on("disconnecting", function() {
      console.log(`[${now()}] disconnecting to MongoDB`);
    });

    mongoose.connection.on("disconnected", function() {
      console.log(`[${now()}] disconnected to MongoDB`);
    });

    mongoose.connection.on("reconnected", function() {
      console.log(`[${now()}] reconnected to MongoDB`);
    })

    const db = await mongoose.connect(connection_string, options);

    return db;
  } catch (e) {
    console.log(`Failed connect to Mongodb: ${JSON.stringify(e)}`);
  } 
}

const loadModels = () => {
  return new Promise((resolve) => {
    glob("modules/*/models/*.js", async function(err, file_paths) {
      if (err) {
        console.log(`loadModels error: ${JSON.stringify(err)}`);
        return resolve();
      }
      for (const file_path of file_paths) {
        await import(`../${file_path}`);
      }

      return resolve(true);
    });
  });
}

export default { connect, loadModels };