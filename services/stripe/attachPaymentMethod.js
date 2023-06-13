require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const attachPaymentMethod = async ({ paymentMethod, customerId }) => {
  try {
    const paymentMethodAttach = await stripe.paymentMethods.attach(
      paymentMethod.id,
      {
        customer: customerId,
      }
    );
    return [paymentMethodAttach, null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = attachPaymentMethod;
