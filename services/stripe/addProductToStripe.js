const logger = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const addProductToStripe = async (name, product_id) => {
  try {
    const product = await stripe.products.create({
      name: name,
      id: product_id,
    });

    return [product, null];
  } catch (error) {
    logger.error(`Error while adding product to stripe ${error}`);
    return [null, err];
  }
};

module.exports = addProductToStripe;
