const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { createStripeWebHook } = require("./controllers/stripe.controller");

const app = express();

app.use(helmet());
app.use(cors());

// app.use((req, res, next) => {
//   if (req.originalUrl === "/webhook") {
//     next(); // Do nothing with the body because I need it in a raw state.
//   } else {
//     express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
//   }
// });

app.use(express.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
// app.use("/webhook", bodyParser.raw({ type: "application/json" }));
app.post("/stripe/webhook", createStripeWebHook);

// app.use(express.json());
const routes = require("./routes");
const { verify } = require("jsonwebtoken");
app.use("/ecommerce", routes);

  app.get("/", (_, res) => {
  res.status(200).send("Backend up and running");
});

module.exports = app;
