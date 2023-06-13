const db = require("../db/models");
const attachPaymentMethod = require("../services/stripe/attachPaymentMethod");
const confirmPaymentIntent = require("../services/stripe/confirmPaymentIntent");
const createPaymentIntent = require("../services/stripe/createPaymentIntent");
const createStripeCustomer = require("../services/stripe/createStripeCustomer");
const listCustomerPayMethods = require("../services/stripe/getPaymentMethods");

const logger = require("../utils/logger");
const {
  serverErrorResponse,
  successResponse,
  notFoundResponse,
} = require("../utils/response");

const User = db.User;

const createCustomer = async (req, res) => {
  const { name, email, phone } = req.body;
  const { user_id } = req.user;
  const [customer, error] = await createStripeCustomer(name, email, phone);
  if (error) {
    serverErrorResponse(res, "an error occured");
  }

  // add the stripe customer id to user table
  User.findOne({ where: { user_id: user_id } })
    .then((user) => {
      if (user) {
        user.stripe_customer_id = customer.id;
        return user.save();
      } else {
        logger.error("User not found");

        return null;
      }
    })
    .then((updatedUser) => {
      if (updatedUser) {
        console.log("User updated successfully:", updatedUser.toJSON());
      }
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });

  successResponse(res, "Customer created", customer);
};

const attachPayment = async (req, res) => {
  const { user_id } = req.user;
  const { paymentMethod } = req.body;
  let customerId;
  User.findOne({ where: { user_id: user_id } })
    .then((user) => {
      if (user) {
        customerId = user.stripe_customer_id;
      } else {
        logger.error("User not found");
        notFoundResponse("user not found");
      }
    })
    .catch((error) => {
      logger.error(error.message);
    });

  const [attach, error] = await attachPaymentMethod({
    paymentMethod,
    customerId,
  });
  if (error) {
    serverErrorResponse(res, "an error occured");
  }
  successResponse(res, "payment mehtod attached", attach);
};

const getPaymentMethods = async (req, res) => {
  let customerId;
  User.findOne({ where: { user_id: user_id } })
    .then((user) => {
      if (user) {
        customerId = user.stripe_customer_id;
      } else {
        logger.error("User not found");
        notFoundResponse("user not found");
      }
    })
    .catch((error) => {
      logger.error(error.message);
    });

  const [paymentMethods, err] = await listCustomerPayMethods(customerId);

  if (err) serverErrorResponse(res, "an error occured ");
  successResponse(res, "Payment methods fetched", paymentMethods);
};

const makePaymentIntent = async (req, res) => {
  const { amount, currency, paymentMethod } = req.body;
  let userCustomerId;
  User.findOne({ where: { user_id: user_id } })
    .then((user) => {
      if (user) {
        userCustomerId = user.stripe_customer_id;
      } else {
        logger.error("User not found");
        notFoundResponse("user not found");
      }
    })
    .catch((error) => {
      logger.error(error.message);
    });

  const [paymentIntent, err] = await createPaymentIntent({
    amount,
    currency,
    userCustomerId,
    paymentMethod,
  });

  if (err) serverErrorResponse(res, "an error occured");
  successResponse(res, "Payment intent created", paymentIntent);
};

const confirmIntent = async (req, res) => {
  const { paymentMethod, paymentIntent } = req.body;
  const [confirmIntent, err] = await confirmPaymentIntent({
    paymentMethod,
    paymentIntent,
  });
   if (err) serverErrorResponse(res, "error during confirmation");
  successResponse(res, "Payment confirmed", confirmIntent);
};

module.exports = {
  createCustomer,
  attachPayment,
  getPaymentMethods,
  makePaymentIntent,
  confirmIntent,
};
