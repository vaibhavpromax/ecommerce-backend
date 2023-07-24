const logger = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const deletePriceInStripe = async ({ price_id }) => {
    // price can't be deleted so setup active status to false so that it can't be used further 
  try {
    const price = await stripe.prices.update({
      price_id,
      active: false,
    });
    return [price, null];
  } catch (error) {
    logger.error(`Error while delete price in stripe ${error} `);
    return [null, err];
  }
};

module.exports = deletePriceInStripe;
