require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async ({
  amount,
  currency,
  userCustomerId,
  paymentMethod,
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      customer: userCustomerId,
      payment_method: paymentMethod,
      confirmation_method: "manual", // For 3D Security
      description: "Buy Product",
    });
    return [paymentIntent, null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = createPaymentIntent;
