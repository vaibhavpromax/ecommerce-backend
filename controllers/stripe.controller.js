require("dotenv").config();
const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Cart = db.Cart;
const Order = db.Order;
const OrderItem = db.OrderItem;

// this function is called when payment confirm webhook is called
const confirmOrder = async ({ intent_id }) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(intent_id);
  const cart_id = paymentIntent.metadata["cart_id"];
  const user_id = paymentIntent.metadata["user_id"];
  const address_id = paymentIntent.metadata["address_id"];
  let cart;
  try {
    cart = Cart.findOne({ where: { cart_id } });
  } catch (error) {
    logger.error(`Error while finding cart while confirming order ${error}`);
    return;
  }
  const parsedCart = JSON.parse(JSON.stringify(cart));
  try {
    const order = Order.create({
      user_id,
      address_id,
      stripe_payment_id,
      total_price,
      shipping_price,
      order_status: "PLACED",
      cart_id: cart.cart_id,
    });
    const parsedOrder = JSON.parse(JSON.stringify(order));

    try {
      parsedCart.CartItems.map((item) => {
        OrderItem.create({
          product_id: item.product_id,
          item_quantity: item.cart_quantity,
          order_id: parsedOrder.order,
        });
      });
    } catch (error) {
      logger.error(`Error while creating order item ${error}`);
    }
  } catch (error) {
    logger.error(`Error while creating order ${error}`);
    return [null, error];
  }
};

const createStripeWebHook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  const payload = {
    id: "evt_test_webhook",
    object: "event",
  };
  const payloadString = JSON.stringify(payload);
  const secret =
    "whsec_873af8b47d740acfdd75d54cd904445e8d70bc63ed5662f05ace026df15696f";

  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret,
  });

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(event);
  } catch (err) {
    console.log(err);
    serverErrorResponse(res, "error occured while creating webhook");
  }

  // Unexpected event type
  switch (event.type) {
    case "payment_intent.succeeded":
      intent = event.data.object;
      confirmOrder(intent.id);
      console.log("Succeeded:", intent.id);
      break;
    case "payment_intent.payment_failed":
      intent = event.data.object;
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log("Failed:", intent.id, message);
      break;
    case "invoice.payment_succeeded":
      if (dataObject["billing_reason"] == "subscription_create") {
        // The subscription automatically activates after successful payment
        // Set the payment method used to pay the first invoice
        // as the default payment method for that subscription
        const subscription_id = dataObject["subscription"];
        const payment_intent_id = dataObject["payment_intent"];

        // Retrieve the payment intent used to pay the subscription
        const payment_intent = await stripe.paymentIntents.retrieve(
          payment_intent_id
        );

        try {
          const subscription = await stripe.subscriptions.update(
            subscription_id,
            {
              default_payment_method: payment_intent.payment_method,
            }
          );
          console.log(
            "Default payment method set for subscription:" +
              payment_intent.payment_method
          );
        } catch (err) {
          console.log(err);
          console.log(
            `⚠️  Falied to update the default payment method for subscription: ${subscription_id}`
          );
        }
      }

      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break;
    case "invoice.finalized":
      // If you want to manually send out invoices to your customers
      // or store them locally to reference to avoid hitting Stripe rate limits.
      break;
    case "customer.subscription.deleted":
      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break;
    case "customer.subscription.trial_will_end":
      // Send notification to your user that the trial will end
      break;

    default:
    // Unexpected event type
  }

  // Return a 200 response to acknowledge receipt of the event
  successResponse(res, "event received", event);
};

module.exports = { createStripeWebHook };
