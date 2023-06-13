require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const confirmPaymentIntent = async ({ paymentMethod, paymentIntent }) => {
  try {
    const intent = await stripe.paymentIntents.confirm(paymentIntent, {
      payment_method: paymentMethod,
    });
    return [intent, null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = confirmPaymentIntent;
