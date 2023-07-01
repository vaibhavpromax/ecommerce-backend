const { where } = require("sequelize");
const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const addToCart = async (req, res) => {
  const { user_id } = req.user;
  const { product_id, quantity } = req.body;

  // if item is already present in cart for a user , add to it
  const Cart = Cart.update(
    { cart_quantity: db.sequelize.literal(`cart_quantity - ${quantity}`) },
    {
      where: {
        user_id: user_id,
        product_id: product_id,
      },
    }
  );

  if 



};

module.exports = { addToCart };
