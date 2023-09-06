const logger = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createSetupIntent = async ({ customer, payment_method }) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      automatic_payment_methods: { enabled: true, allow_redirects: "always" },
      customer: customer,
      usage: "on_session",
      confirm: true,
      payment_method: payment_method,
      return_url: "https://dev.ungraindanslaboite.com/checkout",
      use_stripe_sdk: true,
    });
    logger.info(`Setup intent created ${setupIntent}`);
    return [setupIntent, null];
  } catch (err) {
    logger.error(`Error while creating setup intent ${err}`);
    return [null, err];
  }
};

module.exports = createSetupIntent;
