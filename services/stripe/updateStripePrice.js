const logger = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const updateStripePrice = async (price_id, unitAmount) => {
  try {
    const price = await stripe.prices.update({
      price_id,
      unit_amount: unitAmount,
    });

    return [price, null];
  } catch (error) {
    logger.error(`Error while adding price to stripe ${error} `);
    return [null, error];
  }
};

module.exports = updateStripePrice;
