const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Cart = db.Cart;

const addToCart = async (req, res) => {
  const { user_id } = req.user;
  const { product_id, quantity } = req.body;

  // if the coming quantity is zero
  if (quantity == 0) {
    try {
      const deletedRows = await Cart.destroy({
        where: {
          product_id: product_id,
        },
      });
      return successResponse(res, "Cart updated successfully");
    } catch (error) {
      logger.error("Error updating cart", error);
      return serverErrorResponse(res, "Error updating cart", error);
    }
  }

  // if item is already present in cart for a user , update the quantity as per it
  try {
    const numberOfUpdatedItems = await Cart.update(
      { cart_quantity: quantity },
      {
        where: {
          user_id: user_id,
          product_id: product_id,
        },
      }
    );
    return successResponse(
      res,
      "Cart updated successfully",
      numberOfUpdatedItems
    );
  } catch (error) {
    logger.error("Error updating cart", error);
    return serverErrorResponse(res, "Error updating cart", error);
  }
};

const getCart = async (req, res) => {
  const { user_id } = req.user;
  try {
    const Cart = Cart.findAll({
      where: {
        user_id: user_id,
      },
    });
    return successResponse(res, "Cart fetched successfully", Cart);
  } catch (error) {
    logger.error("Error fetching cart", error);
    return serverErrorResponse(res, "Error fetching cart", error);
  }
};

module.exports = { addToCart, getCart };
