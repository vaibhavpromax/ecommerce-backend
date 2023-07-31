const express = require("express");
const {
  createCustomer,
  attachPayment,
  getPaymentMethods,
  makePaymentIntent,
  confirmIntent,
} = require("../controllers/payment.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");

const router = express.Router();

router.post("/create-stripe-customer", authMiddleware, createCustomer);
router.post("/attach", authMiddleware, attachPayment);
router.post("/get-payment-methods", authMiddleware, getPaymentMethods);
router.post("/create-intent", authMiddleware, makePaymentIntent);
router.post("/confirm-payment", confirmIntent);

// reviews

module.exports = router;
