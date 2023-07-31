const db = require("../db/models");
const upload = require("../services/amazon/uploadImage");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Product = db.Product;

const addImagetoProduct = async ({ product_id, req }, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // Handle error
      return serverErrorResponse("error uploading image to S3");
    }
    // File uploaded successfully
    imageUrl = req.file.location;
  });

  try {
    await Product.update(
      {
        image: imageUrl,
      },
      { where: { product_id: product_id } }
    );
    return successResponse(res, "Image added to product");
  } catch (err) {
    logger.error(err);
  }
};

module.exports = addImagetoProduct;
