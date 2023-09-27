const express = require("express");
const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  addImageToProduct,
  getProductsFromId,
} = require("../controllers/product.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");
const upload = require("../services/amazon/uploadImage");
const router = express.Router();

router.post("/get-products", getProductsFromId);
router.get("/get-product/:product_id", getSingleProduct);

module.exports = router;
