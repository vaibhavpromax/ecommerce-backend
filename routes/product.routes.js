const express = require("express");
const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addImage,
} = require("../controllers/product.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");
const upload = require("../services/amazon/uploadImage");
const router = express.Router();

router.get("/get-products", authMiddleware, getProducts);
router.get("/get-product/:product_id", authMiddleware, getSingleProduct);
router.post("/add-product", createProduct);
router.patch("/update-product/:product_id", updateProduct);
router.post("/add-image", addImage);
router.delete("/delete-product/:product_id", deleteProduct);

module.exports = router;
