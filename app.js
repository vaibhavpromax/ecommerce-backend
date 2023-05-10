const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes");
app.use("/ecommerce", routes);

app.get("/", (_, res) => {
  res.status(200).send("Backend up and running");
});

module.exports = app;
