const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Wishlist = db.Wishlist;
const Product = db.Product;
const Image = db.Image;

const createWishlist = async (req, res) => {
  console.log("hello", req.user);
  const { user_id } = req.user;
  const { id } = req.params;
  let create_wish_params;
  if (user_id) create_wish_params = { product_id: id, user_id };
  try {
    const wishlist = await Wishlist.findOrCreate({
      where: create_wish_params,
    });
    return successResponse(res, "Wishlist created successfully", wishlist);
  } catch (error) {
    logger.error(`Error while creating wishlist ${error}`);
    return serverErrorResponse(res, "Error while creating wishlist");
  }
};
const getWishlist = async (req, res) => {
  const { user_id } = req.user;
  let get_wish_params;
  if (user_id) get_wish_params = { user_id: user_id };
  try {
    const list = await Wishlist.findAll({
      where: get_wish_params,
      include: {
        model: Product,
        include: Image,
      },
    });

    let modified_response;
    return successResponse(res, "Wishlist fetced successfully", list);
  } catch (err) {
    logger.error(`Error while fetching wishlist ${err}`);
    return serverErrorResponse(res, "Error while fetching wishlist");
  }
};

const removeFromWishlist = async (req, res) => {
  const { user_id } = req.user;
  const { id } = req.params;

  let remove_wish_params;
  if (user_id) remove_wish_params = { user_id: user_id, product_id: id };
  try {
    const deleted_rows = Wishlist.destroy({
      where: remove_wish_params,
    });
    return successResponse(
      res,
      "Successfully removed from wishlist",
      deleted_rows
    );
  } catch (err) {
    logger.error(`Error while removing from wishlist ${err}`);
    return serverErrorResponse(res, "Error while removing ");
  }
};

module.exports = { createWishlist, getWishlist, removeFromWishlist };
