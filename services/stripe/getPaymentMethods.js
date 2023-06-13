require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const listCustomerPayMethods = async (customerId) => {
  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerId,
      {
        type: "card",
      }
    );
    return [paymentMethods, null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = listCustomerPayMethods;
