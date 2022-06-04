'use strict';

import glob from "glob";
import cors from "cors";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import http from "http";

function initServerRoute(app) {
  return new Promise((resolve) => {
    glob("modules/!(core)/routes/*.js", async function(err, file_paths) {
      if (err) {
        console.log(`loadAppRoute error: ${JSON.stringify(err)}`);
        return resolve();
      }

      for (const file_path of file_paths) {
        const { default: defaultFunc } = await import(`../${file_path}`);
        defaultFunc(app);
      }

      app.use("*", (req, res) => res.json({ success: true }));

      return resolve(true);
    });
  })
}

function initBodyParser(app) {
  app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }))
  // parse application/json
  app.use(bodyParser.json({ limit: "1mb" }))
}

function initExpressSession(app, db, io) {
  const sessionMiddleware = session({
    name: 'sn',
    secret: 'social_network',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      secure: false,
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000 //ms
    },
    store: MongoStore.create({
      client: db.connection.getClient(),
      stringify: false
    })
  });

  app.use(sessionMiddleware);

  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

  io.use(wrap(sessionMiddleware));
};

function initSocket(io) {
  return new Promise((resolve) => {
    glob("modules/*/socket/*.js", async function(err, file_paths) {
      if (err) {
        console.log(`loadAppRoute error: ${JSON.stringify(err)}`);
        return resolve();
      }
      for (const file_path of file_paths) {
        const { default: defaultFunc } = await import(`../${file_path}`);
        defaultFunc(io)
      }

      return resolve(true);
    });
  });
}

function initErrorHandleMiddleware(app) {
  app.use((err, req, res, next) => res.status(500).send());
}

const init = async function(db) {
  const app = express();

  const server = http.createServer(app);

  const io = new Server(server, { 
    cors: {
      origin: "http://localhost:3001",
      credentials: true
    }
  });

  app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
  }));

  initBodyParser(app);

  initExpressSession(app, db, io);

  await initServerRoute(app);

  await initSocket(io);

  initErrorHandleMiddleware(app);

  server.listen(3000, () => console.log("App is running on port 3000"));
};

export default { init }