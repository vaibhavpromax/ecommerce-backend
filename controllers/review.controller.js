const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Review = db.Review;

const add_review = async (req, res) => {
  const { user_id } = req.user;
  const { order_id, product_id, description, rating } = req.body;
  try {
    const createdObject = await Review.create({
      user_id: user_id,
      product_id: product_id,
      description: description,
      rating: rating,
      order_id: order_id,
    });
    successResponse(res, "Review added successfully", createdObject);
  } catch (err) {
    logger.error(`Error while creating review ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const delete_review = async (req, res) => {
  const { review_id } = req.params;
  try {
    const deletedObject = await Review.destroy({
      where: {
        review_id: review_id,
      },
    });
    successResponse(res, "Review deleted successfully", deletedObject);
  } catch (err) {
    logger.error(`Error while deleting review ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const get_product_reviews = async (req, res) => {
  const { product_id } = req.body;
}


module.exports = {
  add_review,
  delete_review,
};
