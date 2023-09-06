require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const confirmPaymentIntent = async ({ paymentMethod, paymentIntent }) => {
  try {
    const intent = await stripe.paymentIntents.confirm(paymentIntent, {
      payment_method: paymentMethod,
      return_url: "https://dev.ungraindanslaboite.com/profile",
    });

    return [intent, null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = confirmPaymentIntent;
