const express = require("express");
const {
  createCustomer,
  attachPayment,
  getPaymentMethods,
  makePaymentIntent,
  confirmIntent,
} = require("../controllers/payment.controller");
const { isAuth } = require("../controllers/user/auth.controller");

const router = express.Router();

router.post("/create-stripe-customer", isAuth, createCustomer);
router.post("/attach", isAuth, attachPayment);
router.post("/get-payment-methods", isAuth, getPaymentMethods);
router.post("/create-intent", isAuth, makePaymentIntent);
router.post("/confirm-payment", confirmIntent);

// reviews

module.exports = router;
