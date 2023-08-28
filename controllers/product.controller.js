const { response } = require("express");
const db = require("../db/models");
// const addImagetoProduct = require("../helpers/addImageToProduct");

const logger = require("../utils/logger");
const {
  serverErrorResponse,
  successResponse,
  notFoundResponse,
} = require("../utils/response");
const addProductToStripe = require("../services/stripe/addProductToStripe");
const addPriceToStripe = require("../services/stripe/addPriceToStripe");
const updateStripePrice = require("../services/stripe/updateStripePrice");
const upload = require("../services/amazon/uploadImage");

const Product = db.Product;
const Image = db.Image;
const Review = db.Review;
const Wishlist = db.Wishlist;

const getProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.findAll();
    return successResponse(res, "all products fetched successfully", products);
  } catch (err) {
    logger.error(`Error while fetching products ${err}`);
    return serverErrorResponse(res, "Error while fetching products");
  }
};

const getProductsFromId = async (req, res) => {
  const { product_arr } = req.body;
  let options;
  if (product_arr) {
    options = {
      where: {
        product_id: product_arr,
      },
      include: {
        model: Image,
      },
    };
  } else {
    options = {
      include: {
        model: Image,
      },
    };
  }
  try {
    const products = await Product.findAll(options);

    return successResponse(res, "Fetched Products successfully", products);
  } catch (error) {
    logger.error(`Error while fetching products ${error}`);
    return serverErrorResponse(res, "Error while fetching products");
  }
};

const getSingleProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const product = await Product.findOne({
      where: {
        product_id,
      },
      include: [
        {
          model: Image,
        },
        { model: Review },
      ],
    });
    return successResponse(res, "product fetched successfully", product);
  } catch (err) {
    logger.error(`Error while fetching product ${err}`);
    return serverErrorResponse(res, "Error while fetching product");
  }
};

// upload product to s3 get the links and then create all together
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
    sec_images,
    primary_image,
  } = req.body;

  console.log("pri", primary_image);
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
      discount_begin_date: "2023-07-28 15:09:07",
      discount_end_date: "2023-07-28 15:09:07",
    });

    const parsedProduct = JSON.parse(JSON.stringify(product));

    sec_images.map(async (img) => {
      await Image.create({
        product_id: parsedProduct.product_id,
        image_url: img.url,
        user_id: null,
        is_primary: false,
      });
    });

    await Image.create({
      product_id: parsedProduct.product_id,
      image_url: primary_image,
      user_id: null,
      is_primary: true,
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

// not using this logic
const addImageToProduct = async (req, res) => {
  const { product_id, is_primary } = req.body;
  try {
    const newImage = await Image.create({
      product_id,
      image_url: req.file.location,
      user_id: null,
      is_primary,
    });
    return successResponse(res, "Product Image uploaded", newImage);
  } catch (error) {
    logger.error(`Error while updating the image table ${error}`);
    return serverErrorResponse(res, "Error while uploading image");
  }
};

module.exports = {
  getSingleProduct,
  getProductsForAdmin,
  createProduct,
  deleteProduct,
  updateProduct,
  addImageToProduct,
  getProductsFromId,
};
