import express from "express";
import cors from "cors";

import db from "./db.js";
import mainRoute from "./routers.js";

const app = express();

const PORT = 1872;

const VERSION = 'v1';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(`/${VERSION}`, mainRoute);

app.use((err, req, res, next) => {
  if (!err) return next();
  const { message, status  } = err;
  return res.status(status || 500).json({
    message: message || 'INTERNAL_ERROR',
  })
});

db.init(app);

app.listen(PORT, (err) => {
  if (err) {
    console.log("ERROR OCCURS", err);
  } else {
    console.log("APP STARTED AT", PORT);
  }
});
