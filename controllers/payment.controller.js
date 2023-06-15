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
    return serverErrorResponse(res, "an error occured");
  }

  try {
    await User.update(
      {
        stripe_customer_id: customer.id,
      },
      { where: { user_id: user_id } }
    );
  } catch (err) {
    logger.error(err);
  }

  return successResponse(res, "Customer created", customer);
};

const attachPayment = async (req, res) => {
  const { user_id } = req.user;
  const { paymentMethod } = req.body;
  const dbUser = await User.findOne({ where: { user_id: user_id } });

  if (dbUser === null) {
    return notFoundResponse("user not found");
  }
  const customerId = dbUser.dataValues.stripe_customer_id;

  const [attach, error] = await attachPaymentMethod({
    paymentMethod,
    customerId,
  });
  if (error) {
    return serverErrorResponse(res, "an error occured while attaching");
  }
  return successResponse(res, "payment mehtod attached", attach);
};

const getPaymentMethods = async (req, res) => {
  let customerId;
  const { user_id } = req.user;

  User.findOne({ where: { user_id: user_id } })
    .then((user) => {
      if (user) {
        customerId = user.stripe_customer_id;
      } else {
        logger.error("User not found");
        return notFoundResponse("user not found");
      }
    })
    .catch((error) => {
      logger.error(error.message);
    });

  const [paymentMethods, err] = await listCustomerPayMethods(customerId);

  if (err) return serverErrorResponse(res, "an error occured ");
  return successResponse(res, "Payment methods fetched", paymentMethods);
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
        return notFoundResponse("user not found");
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

  if (err) return serverErrorResponse(res, "an error occured");
  return successResponse(res, "Payment intent created", paymentIntent);
};

const confirmIntent = async (req, res) => {
  const { paymentMethod, paymentIntent } = req.body;
  const [confirmIntent, err] = await confirmPaymentIntent({
    paymentMethod,
    paymentIntent,
  });
  if (err) return serverErrorResponse(res, "error during confirmation");
  return successResponse(res, "Payment confirmed", confirmIntent);
};

module.exports = {
  createCustomer,
  attachPayment,
  getPaymentMethods,
  makePaymentIntent,
  confirmIntent,
};
