const logger = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const addPriceToStripe = async ({ currency, unitAmount, product_id }) => {
  try {
    const price = await stripe.prices.create({
      product: product_id,
      unit_amount: unitAmount,
      currency: currency,
    });

    return [price, null];
  } catch (error) {
    logger.error("Error while adding price to stripe", error);
    return [null, err];
  }
};

module.exports = addPriceToStripe;
