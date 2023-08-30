const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Order = db.Order;
const Product = db.Product;
const User = db.User;
const Address = db.Address;
const Review = db.Review;
const Discount = db.Discount;
const Image = db.Image;
const OrderItem = db.OrderItem;

const get_all_orders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: {
        model: OrderItem,
        include: {
          model: Product,
          include: Image,
        },
      },
    });
    return successResponse(res, "all orders fetched successfully", orders);
  } catch (err) {
    logger.error(`Error while fetching orders ${err}`);
    return serverErrorResponse(res, "Error while fetching orders");
  }
};

const get_orders_of_user = async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await Order.findAll({
      where: {
        user_id: user_id,
      },
    });
    return successResponse(res, "All orders fetched successfully", orders);
  } catch (error) {
    logger.error(`Error while fetching orders ${error}`);
    return serverErrorResponse(
      res,
      "Error while fetching the orders of a user"
    );
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  const { order_id } = req.params;
  let user, product, order, address, review;
  try {
    const order = await Order.findOne({
      where: {
        order_id: order_id,
      },
      include: [
        {
          model: User,
        },
        {
          model: OrderItem,
          include: {
            model: Product,
            include: {
              model: Image,
            },
          },
        },
        ,
        {
          model: Address,
        },
      ],
    });
    logger.info(`Order fetched successfully ${order}`);
    return successResponse("Order fetched", order);
  } catch (err) {
    logger.error(`Error while fetching order ${err}`);
    return serverErrorResponse(res, "Error while fetching order");
  }
};

const update_order = async (req, res) => {
  const { order_id } = req.params;
  const { product_id, quantity, address_id, total_price, is_order_completed } =
    req.body;
  try {
    const order = await Order.update(
      {
        product_id,
        quantity,
        address_id,
        total_price,
        is_order_completed,
      },
      {
        where: {
          order_id: order_id,
        },
      }
    );
    return successResponse(res, "order updated successfully", order);
  } catch (err) {
    logger.error(`Error while updating order ${err}`);
    return serverErrorResponse(res, "Error while updating order");
  }
};

module.exports = {
  get_all_orders,
  getOrderDetailsForAdmin,
  update_order,
  get_orders_of_user,
};
