const db = require("../db/models");
const coupongenerator = require("../helpers/createDiscountCode");

const logger = require("../utils/logger");
const {
  serverErrorResponse,
  successResponse,
  notFoundResponse,
} = require("../utils/response");

const Discount = db.Discount;
const Order = db.Order;

const createDiscount = async (req, res) => {
  const { value, is_percent, expiryDate } = req.body;
  const coupon = coupongenerator();

  try {
    const discount = await Discount.create({
      code: coupon,
      is_percent,
      expiryDate,
      value,
      isActive: true,
    });
    return successResponse(res, "disount created successfully ", discount);
  } catch (error) {
    logger.error(`Error while creating discount ${error}`);
    return serverErrorResponse(res, "Error while creating discount");
  }
};

const applyDiscount = async (req, res) => {
  const { code, order_id } = req.body;

  const discount = Discount.findOne({
    where: {
      code: code,
    },
  });

  if (discount === null) return notFoundResponse(res, "No coupon found");

  const order = Order.findOne({ where: { order_id: order_id } });

  if (order === null) return notFoundResponse(res, "Order does not exist ");
  



};

module.exports = {
  createDiscount,
  applyDiscount,
};
