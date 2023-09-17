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

<<<<<<< HEAD
app.post("/stripe/webhook", express.raw({ type: 'application/json' }), createStripeWebHook);
app.use(express.json());

=======
// app.use((req, res, next) => {
// if (req.originalUrl === "/webhook") {
// next(); // Do nothing with the body because I need it in a raw state.
//} else {
// express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
// }
//});

//app.use(express.urlencoded({ extended: false }));
//app.use(
//bodyParser.json({
//verify: (req, res, buf) => {
//req.rawBody = buf;
// },
//})
//);
// app.use("/webhook", bodyParser.raw({ type: "application/json" }));
//app.use('/stripe/webhook', bodyParser.raw({type: "*/*"}))
//app.use((req, res, next) => {
//console.log(req.originalUrl);
//if (req.originalUrl === '/stripe/webhook') {
//next(); // Do nothing with the body because I need it in a raw state.
//} else {
//express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
//}
//});

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  createStripeWebHook
);

app.use(express.json());
>>>>>>> bc5e7ca66cb02fdf650f1007c5a5f26447e4296f

const routes = require("./routes");
const { verify } = require("jsonwebtoken");
app.use("/ecommerce", routes);

app.get("/", (_, res) => {
  res.status(200).send("Backend up and running");
});

module.exports = app;
