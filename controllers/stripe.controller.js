require("dotenv").config();
const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Cart = db.Cart;
const Order = db.Order;
const OrderItem = db.OrderItem;
const CartItem=db.CartItem;

// this function is called when payment confirm webhook is called
const confirmOrder = async (intent_id ) => {


  const paymentIntent = await stripe.paymentIntents.retrieve(intent_id);

//console.log('paymentIntent' , paymentIntent)

  const cart_id = paymentIntent.metadata["cart_id"];
  const user_id = paymentIntent.metadata["user_id"];
  const address_id = paymentIntent.metadata["address_id"];
  let cart;
  try {
    cart = await Cart.findOne({ where: { cart_id } , include:CartItem });
  } catch (error) {
    logger.error(`Error while finding cart while confirming order ${error}`);
    return;
  }


  const parsedCart = JSON.parse(JSON.stringify(cart));
  
console.log(parsedCart);
try {
    const order = await Order.create({
      user_id,
      address_id,
      stripe_payment_id:paymentIntent.id,
      total_price:parsedCart?.cart_total,
      shipping_price:"20",
      order_status: "PLACED",
      cart_id: cart.cart_id,
    });
    const parsedOrder = JSON.parse(JSON.stringify(order));

console.log(parsedOrder)

    try {
      parsedCart?.CartItems.map(async(item) => {
await OrderItem.create({
          product_id: item.product_id,
          item_quantity: item.cart_quantity,
          order_id: parsedOrder.order_id,
        });
      });
    } catch (error) {
      logger.error(`Error while creating order item ${error}`);
    }
  } catch (error) {
    logger.error(`Error while creating order ${error}`);
    return [null, error];
  }

logger.info(`Order Created successsfully for intent id ${intent_id} ` )

};

const createStripeWebHook = async (req, res) => {
logger.info('hello from webhook')
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
logger.info("Webhook received");   
 console.log(event);
  } catch (err) {
logger.error("error in webhook ");
    console.log(err);
    serverErrorResponse(res, "error occured while creating webhook");
  }

  // Unexpected event type
  switch (event.type) {

case  "customer.created":
logger.info("stripe customer created");
break;



    case "payment_intent.succeeded" :
      intent = event.data.object;
      confirmOrder(intent.id);
      console.log("Succeeded:", intent.id);
      break;
case "payment_intent.requires_action":
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
