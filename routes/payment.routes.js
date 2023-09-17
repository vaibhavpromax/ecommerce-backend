const express = require("express");
const {
  createCustomer,
  createAndAttachPaymentMethod,
  getPaymentMethods,
  makePaymentIntent,
  confirmIntent,
  createPaymentIntentWithoutAttaching,
} = require("../controllers/payment.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");

const router = express.Router();

// router.post("/create-stripe-customer", authMiddleware, createCustomer);
router.post("/attach", authMiddleware, createAndAttachPaymentMethod);
router.post("/get-payment-methods", authMiddleware, getPaymentMethods);
router.post("/create-intent", authMiddleware, makePaymentIntent);
router.post("/confirm-payment", authMiddleware, confirmIntent);
router.post(
  "/pay-without-attach",
  authMiddleware,
  createPaymentIntentWithoutAttaching
);

// reviews

module.exports = router;
