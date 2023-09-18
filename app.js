require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { createStripeWebHook } = require("./controllers/stripe.controller");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(helmet());
app.use(cors());

app.post("/stripe/webhook", express.raw({ type: 'application/json' }), createStripeWebHook);
app.use(express.json());


const routes = require("./routes");
const { verify } = require("jsonwebtoken");
app.use("/ecommerce", routes);

app.get("/", (_, res) => {
  res.status(200).send("Backend up and running");
});

module.exports = app;
