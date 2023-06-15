require("dotenv").config();
const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createStripeWebHook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  const payload = {
    id: "evt_test_webhook",
    object: "event",
  };
  const payloadString = JSON.stringify(payload);
  const secret =
    "whsec_873af8b47d740acfdd75d54cd904445e8d70bc63ed5662f05ace026df15696f";

  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret,
  });

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, header, secret);
    console.log(event);
  } catch (err) {
    console.log(err);
    serverErrorResponse(res, "error occured while creating webhook");
  }

  // Return a 200 response to acknowledge receipt of the event
  //   successResponse(res, "event received", event);
};

module.exports = { createStripeWebHook };
