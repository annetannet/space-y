import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(express.static(path.join(rootDir, "spa/build")));

app.use(/\/((?!client\.mjs).)+/, function(req, res) {
  res.sendFile(path.join(rootDir, "spa/build/index.html"));
});

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

app.get("/", (_, res) => {
  res.send(":)");
});

https
  .createServer(
    {
      key: fs.readFileSync(path.join(rootDir, "certs/server.key")),
      cert: fs.readFileSync(path.join(rootDir, "certs/server.cert")),
    },
    app
  )
  .listen(port, function () {
    console.log(
      `App listening on port ${port}`
    );
  });

