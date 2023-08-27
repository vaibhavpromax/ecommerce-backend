const express = require("express");
const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addImageToProduct,
  getProductsFromId,
} = require("../controllers/product.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");
const upload = require("../services/amazon/uploadImage");
const uploadImage = require("../services/amazon/uploadImage");
const router = express.Router();

router.get("/get-products", authMiddleware, getProductsFromId);
router.get("/get-product/:product_id", authMiddleware, getSingleProduct);
router.patch("/update-product/:product_id", updateProduct);
router.delete("/delete-product/:product_id", deleteProduct);

module.exports = router;
