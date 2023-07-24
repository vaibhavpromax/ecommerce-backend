const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Wishlist = db.Wishlist;

const createWishlist = async (req, res) => {
  const { user_id } = req.user;
  const { product_id } = req.body;
  try {
    const wishlist = Wishlist.create({
      product_id,
      user_id,
    });
    return successResponse(res, "Wishlist created successfully", wishlist);
  } catch (error) {
    logger.error(`Error while creating wishlist ${error}`);
    return serverErrorResponse(res, "Error while creating wishlist", error);
  }
};
const getWishlist = async (req, res) => {
  const { user_id } = req.user;
  try {
    const list = Wishlist.findAll({
      where: {
        user_id: user_id,
      },
    });
    return successResponse(res, "Wishlist fetced successfully", list);
  } catch (err) {
    logger.error(`Error while fetching wishlist ${err}`);
    return serverErrorResponse(res, "Error while fetching wishlist", err);
  }
};

const removeFromWishlist = async (req, res) => {
  const { user_id } = req.user;
  const { id } = req.params;
  try {
    const deleted_rows = Wishlist.destroy({ where: { user_id, wish_id: id } });
    return successResponse("Successfully removed from wishlist", deleted_rows);
  } catch (err) {
    logger.error(`Error while removing from wishlist ${err}`);
    return serverorResponse(res, "Error while removing ", err);
  }
};

module.exports = { createWishlist, getWishlist, removeFromWishlist };
