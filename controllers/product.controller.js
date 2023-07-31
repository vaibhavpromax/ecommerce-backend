const { response } = require("express");
const db = require("../db/models");
const addImagetoProduct = require("../helpers/addImageToProduct");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");
const addProductToStripe = require("../services/stripe/addProductToStripe");
const addPriceToStripe = require("../services/stripe/addPriceToStripe");
const updateStripePrice = require("../services/stripe/updateStripePrice");
const upload = require("../services/amazon/uploadImage");

const Product = db.Product;
const Image = db.Image;
const Review = db.Review;
const Wishlist = db.Wishlist;

const getProducts = async (req, res) => {
  const { user_id, session_id } = req.user;
  let wish_params;
  if (user_id) wish_params = { user_id: user_id };
  if (session_id) wish_params = { session_id: session_id };

  try {
    const products = await Product.findAll({ include: Image });
    const wishlists = await Wishlist.findAll({
      where: wish_params,
    });
    const parsedProducts = JSON.parse(JSON.stringify(products));
    const parsedWishlist = JSON.parse(JSON.stringify(wishlists));
    const wishlist_product_arr = parsedWishlist.map((p) => p.product_id);

    let modified_products_arr;
    modified_products_arr = parsedProducts.map((p) => {
      return {
        ...p,
        is_wishlisted: wishlist_product_arr.includes(p.product_id),
      };
    });
    return successResponse(
      res,
      "all products fetched successfully",
      modified_products_arr
    );
  } catch (err) {
    logger.error(`Error while fetching products ${err}`);
    return serverErrorResponse(res, "Error while fetching products");
  }
};

const getSingleProduct = async (req, res) => {
  const { user_id, session_id } = req.user;
  const { product_id } = req.params;

  let get_prod_params, get_wish_params;
  if (user_id) {
    get_prod_params = { user_id: user_id };
    get_wish_params = {
      user_id: user_id,
      product_id: product_id,
    };
  }
  if (session_id) {
    get_prod_params = { session_id: session_id };
    get_wish_params = {
      session_id: session_id,
      product_id: product_id,
    };
  }

  try {
    const product = await Product.findOne({
      where: get_prod_params,
      include: Image,
    });

    const wishlist = await Wishlist.findOne({
      where: get_wish_params,
    });

    const parsedProduct = JSON.parse(JSON.stringify(product));

    let modified_response = { ...parsedProduct, is_wishlisted: false };
    if (wishlist) modified_response = { ...parsedProduct, is_wishlisted: true };

    return successResponse(
      res,
      "product fetched successfully",
      modified_response
    );
  } catch (err) {
    logger.error(`Error while fetching product ${err}`);
    return serverErrorResponse(res, "Error while fetching product");
  }
};

const createProduct = async (req, res) => {
  const {
    name,
    description,
    inventory_quantity,
    product_type,
    beans_type,
    product_origin,
    product_height,
    product_weight,
    product_width,
    product_length,
    cost_price,
    selling_price,
    is_discount_percentage,
    is_discount_present,
    discount_value,
    discount_begin_date,
    discount_end_date,
  } = req.body;

  try {
    const product = await Product.create({
      name,
      description,
      inventory_quantity,
      product_origin,
      beans_type,
      product_type,
      product_height,
      product_weight,
      product_width,
      product_length,
      cost_price,
      selling_price,
      is_discount_percentage,
      is_discount_present,
      discount_value,
      discount_begin_date,
      discount_end_date,
    });

    //create product in stripe
    logger.info(`Product created in db ${product}`);

    const [stripeProduct, stripeProductError] = await addProductToStripe(
      name,
      product.product_id
    );
    if (stripeProductError) {
      return serverErrorResponse(
        "Error while creating product in stripe",
        stripeProductError
      );
    }

    const [stripePrice, stripePriceError] = await addPriceToStripe(
      "usd",
      selling_price,
      product.product_id
    );

    // add stripe price id to the db
    product.stripe_price_id = stripePrice.id;
    product.save();

    if (stripePriceError) {
      return serverErrorResponse(
        "Error while creating price in stripe",
        stripePriceError
      );
    }
    //add the price in stripe

    return successResponse(res, "product created successfully", product);
  } catch (err) {
    logger.error(`Error while creating product ${err} `);
    return serverErrorResponse(res, "Error while creating product");
  }
};

const deleteProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const product = await Product.destroy({
      where: {
        product_id: product_id,
      },
    });
    return successResponse(res, "product deleted successfully", product);
  } catch (err) {
    logger.error(`Error while deleting product ${err} `);
    return serverErrorResponse(res, "Error while deleting product");
  }
};

const updateProduct = async (req, res) => {
  const { product_id } = req.params;
  const { name, description, price, category, inventory_quantity } = req.body;
  try {
    const product = await Product.update(
      {
        name,
        description,
        price,
        category,
        inventory_quantity,
      },
      {
        where: {
          product_id: product_id,
        },
      }
    );

    // if the price is updated
    if (price) {
      const [updatePriceStripe, updateStripePriceError] =
        await updateStripePrice(product.stripe_price_id, price);
      if (updateStripePriceError)
        logger.error(
          `Error while updating the price of a product in stripe ${updateStripePriceError}`
        );
      return serverErrorResponse(res, "Error while updating the product info");
    }

    return successResponse(res, "product updated successfully", product);
  } catch (err) {
    logger.error(`Error while updating product ${err}`);
    return serverErrorResponse(res, "Error while updating product");
  }
};

const addImage = async (req, res) => {
  const { product_id, is_primary, image_url } = req.body;

  // upload.single("image")(req.body.file, res, (err) => {
  //   if (err) {
  //     // Handle error
  //     logger.error(`Error while uploading to S3 ${err}`);
  //     return serverErrorResponse("error uploading image to S3");
  //   }
  //   // File uploaded successfully
  //   imageUrl = req.file.location;
  // });

  try {
    const newImage = await Image.create({
      product_id,
      image_url,
      user_id: null,
      is_primary,
    });
    return successResponse(res, "Image uploaded", newImage);
  } catch (error) {
    logger.error(`Error while updating the image table ${error}`);
    return serverErrorResponse(res, "Error while uploading image");
  }
};

module.exports = {
  getProducts,
  getSingleProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  addImage,
};
