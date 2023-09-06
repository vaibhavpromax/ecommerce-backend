const logger = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const confirmSetupIntent = async ({ setupIntentId, paymentMethod }) => {
  try {
    const setupIntent = await stripe.setupIntents.confirm(setupIntentId, {
      payment_method: paymentMethod,
      return_url: "https://dev.ungraindanslaboite.com/checkout",
      use_stripe_sdk: true,
    });
    logger.info(`Intent confirmed ${setupIntent}`);
    return [setupIntent, null];
  } catch (err) {
    logger.error(`Error while confirming setup intent ${err}`);
    return [null, err];
  }
};

module.exports = confirmSetupIntent;
