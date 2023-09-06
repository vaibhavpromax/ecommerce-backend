const logger = require("../../utils/logger");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createInvoice = async ({ userCustomerId }) => {
  let invoice;
  try {
    invoice = await stripe.invoices.create({
      customer: userCustomerId,
      auto_advance: true,
      collection_method: "send_invoice",
    });
    logger.info(`Invoice created for customer ${customerId}`);
    await stripe.invoices.sendInvoice(invoice.id);
    return [invoice, null];
  } catch (err) {
    logger.error(`Error while creating invoice for customer ${customerId}`);

    return [null, err];
  }
};

module.exports = createInvoice;
