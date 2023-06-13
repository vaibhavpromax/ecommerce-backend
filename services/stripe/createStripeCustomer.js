require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { serverErrorResponse } = require("../../utils/response");

const createStripeCustomer = async ({ name, email, phone }) => {
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
      phone: phone,
    });
    return [customer, null];
  } catch (err) {
    return [null, err.message];
  }
  
};

module.exports = createStripeCustomer;
