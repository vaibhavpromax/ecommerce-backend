const { log } = require("winston");
const db = require("../db/models");
const attachPaymentMethod = require("../services/stripe/attachPaymentMethod");
const confirmPaymentIntent = require("../services/stripe/confirmPaymentIntent");
const createPaymentIntent = require("../services/stripe/createPaymentIntent");
const createStripeCustomer = require("../services/stripe/createStripeCustomer");
const listCustomerPayMethods = require("../services/stripe/getPaymentMethods");

const logger = require("../utils/logger");
const {
  serverErrorResponse,
  successResponse,
  notFoundResponse,
} = require("../utils/response");
const createSetupIntent = require("../services/stripe/createSetupIntent");
const confirmSetupIntent = require("../services/stripe/confirmSetupIntent");

const User = db.User;
const Cart = db.Cart;
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;

// const createCustomer = async (req, res) => {
//   const { name, email, phone } = req.body;
//   const { user_id } = req.user;
//   const [customer, error] = await createStripeCustomer(name, email, phone);
//   if (error) {
//     return serverErrorResponse(res, "an error occured");
//   }

//   try {
//     await User.update(
//       {
//         stripe_customer_id: customer.id,
//       },
//       { where: { user_id: user_id } }
//     );
//   } catch (err) {
//     logger.error(err);
//   }

//   return successResponse(res, "Customer created", customer);
// };

const createAndAttachPaymentMethod = async (req, res) => {
  const { user_id } = req.user;
  const { paymentMethod } = req.body;
  const dbUser = await User.findOne({ where: { user_id: user_id } });
  const parsedUser = JSON.parse(JSON.stringify(dbUser));
  let name = parsedUser.first_name + parsedUser.last_name;
  if (!dbUser.stripe_customer_id) {
    const [customer, customerError] = await createStripeCustomer({
      name,
      email: parsedUser.email,
      phone: parsedUser.phone_no,
    });
    dbUser.stripe_customer_id = customer.id;
    dbUser.save();
    if (customerError) {
      return serverErrorResponse(res, "an error occured");
    }
  }

  const [setupIntent, setupIntentErr] = await createSetupIntent({
    customer: dbUser.stripe_customer_id,
    payment_method: paymentMethod.id,
  });

  console.log(setupIntent);
  if (setupIntentErr) {
    return serverErrorResponse(res, "an error occured");
  }

  if (setupIntent?.status != "succeeded") {
    return successResponse(res, "Next action needed", {
      next_action: setupIntent?.next_action,
    });
  }

  logger.info(
    `Customer created in stripe with Id ${dbUser.stripe_customer_id}`
  );
  return successResponse(res, "payment mehtod attached");
};

const getPaymentMethods = async (req, res) => {
  let customerId;
  const { user_id } = req.user;
  const user = await User.findOne({ where: { user_id: user_id } });
  if (!user) {
    return notFoundResponse(res, "User with this id does not exist  ");
  }
  const parsedUser = JSON.parse(JSON.stringify(user));
  if (!parsedUser?.stripe_customer_id)
    return successResponse(res, "User not present on stripe");
  const [paymentMethods, err] = await listCustomerPayMethods(
    parsedUser?.stripe_customer_id
  );

  if (err) {
    logger.error(`Error while fetching payment methods ${err}`);
    return serverErrorResponse(res, "an error occured ");
  }
  return successResponse(res, "Payment methods fetched", paymentMethods);
};

const makePaymentIntent = async (req, res) => {
  const { user_id } = req.user;
  const { paymentMethod, address_id } = req.body;
  let userCustomerId, amount, currency;

  const cartArr = await Cart.findAll({
    where: { user_id },
    include: [{ model: User }, { model: Product }],
  });
  const cartObj = JSON.parse(JSON.stringify(cartArr));

  if (cartObj[0].User.stripe_customer_id)
    userCustomerId = cartObj[0].User.stripe_customer_id;
  else {
    logger.error("User not found");
    return notFoundResponse("user not found");
  }
  let total = 0;
  const product_arr = cartObj.map((cartItem) => {
    total =
      total +
      parseFloat(cartItem?.Product?.selling_price) *
        parseInt(cartItem?.cart_quantity);
    return {
      product_id: cartItem.product_id,
      quantity: cartItem.cart_quantity,
    };
  });
  console.log(product_arr);
  // make order entry in the table
  let order;
  try {
    order = await Order.create({
      user_id,
      address_id,
      total_price: total,
      shipping_price: "20",
    });

    const parsedOrder = JSON.parse(JSON.stringify(order));
    cartObj.map(async (item) => {
      await OrderItem.create({
        product_id: item?.Product?.product_id,
        item_quantity: item.cart_quantity,
        order_id: parsedOrder.order_id,
      });
    });
  } catch (error) {
    logger.error(`Error while creating a order ${error}`);
    return serverErrorResponse(res, "Error while creating order");
  }
  logger.info(`The total value of this cart is ${total}`);

  currency = "usd";
  let metadata = {
    order_id: order?.order_id,
    user_id: user_id,
    product_arr: JSON.stringify(product_arr),
  };
  const [paymentIntent, err] = await createPaymentIntent({
    amount: total,
    currency: currency,
    userCustomerId: userCustomerId,
    paymentMethod: paymentMethod.id,
    email: cartObj[0]?.User?.email,
    metadata: metadata,
  });
  if (err) {
    logger.error(`Error while creating a payment intent ${err}`);
    return serverErrorResponse(res, "an error occured");
  }
  return successResponse(res, "Payment intent created", {
    paymentIntent: paymentIntent,
  });
};

const confirmIntent = async (req, res) => {
  const { paymentMethod, paymentIntent } = req.body;
  const [confirmIntent, err] = await confirmPaymentIntent({
    paymentMethod,
    paymentIntent,
  });

  if (err) {
    logger.error(`Error while confirming intent ${err}`);
    return serverErrorResponse(res, "error during confirmation");
  }
  return successResponse(res, "Payment confirmed", {
    confirmIntent: confirmIntent,
  });
};

const createPaymentIntentWithoutAttaching = async (req, res) => {
  const { user_id } = req.user;
  const { paymentMethod, address_id } = req.body;
  let userCustomerId;
  const cartArr = await Cart.findAll({
    where: { user_id },
    include: [{ model: User }, { model: Product }],
  });
  const cartObj = JSON.parse(JSON.stringify(cartArr));

  const dbUser = await User.findOne({ where: { user_id: user_id } });
  const parsedUser = JSON.parse(JSON.stringify(dbUser));
  let name = parsedUser.first_name + " " + parsedUser.last_name;
  // create a stripe customer if there does not exist one
  if (!dbUser.stripe_customer_id) {
    const [customer, customerError] = await createStripeCustomer({
      name,
      email: parsedUser.email,
      phone: parsedUser.phone_no,
    });
    dbUser.stripe_customer_id = customer.id;
    await dbUser.save();
    if (customerError) {
      return serverErrorResponse(res, "an error occured");
    }
  }
  console.log(dbUser.stripe_customer_id);
  userCustomerId = dbUser.stripe_customer_id;
  let total = 0;
  const product_arr = cartObj.map((cartItem) => {
    total =
      total +
      parseFloat(cartItem?.Product?.selling_price) *
        parseInt(cartItem?.cart_quantity);
    return {
      product_id: cartItem.product_id,
      quantity: cartItem.cart_quantity,
    };
  });

  // make order entry in the table
  let order;
  try {
    order = await Order.create({
      user_id,
      address_id,
      total_price: total,
      shipping_price: "20",
    });

    const parsedOrder = JSON.parse(JSON.stringify(order));
    cartObj.map(async (item) => {
      await OrderItem.create({
        product_id: item?.Product?.product_id,
        item_quantity: item.cart_quantity,
        order_id: parsedOrder.order_id,
      });
    });
  } catch (error) {
    logger.error(`Error while creating a order ${error}`);
    return serverErrorResponse(res, "Error while creating order");
  }
  logger.info(`The total value of this cart is ${total}`);

  currency = "usd";

  let metadata = {
    order_id: order?.order_id,
    user_id: user_id,
    product_arr: JSON.stringify(product_arr),
  };

  const [paymentIntent, err] = await createPaymentIntent({
    amount: total,
    currency: currency,
    userCustomerId: userCustomerId,
    paymentMethod: paymentMethod.id,
    email: cartObj[0]?.User?.email,
    confirm: true,
    metadata: metadata,
  });
  if (err) {
    logger.error(`Error while creating a payment intent ${err}`);
    return serverErrorResponse(res, "an error occured");
  }
  return successResponse(res, "Payment intent created", {
    paymentIntent: paymentIntent,
  });
};

module.exports = {
  // createCustomer,
  createAndAttachPaymentMethod,
  createPaymentIntentWithoutAttaching,
  getPaymentMethods,
  makePaymentIntent,
  confirmIntent,
};
