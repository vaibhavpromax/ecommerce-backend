const express = require("express");
const { getProducts, getSingleProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const router = express.Router();

router.get("/get-products", getProducts);
router.get("/get-product/:product_id", getSingleProduct);
router.post("/add-product", createProduct);
router.patch("/update-product/:product_id", updateProduct);
router.delete("/delete-product/:product_id", deleteProduct);


module.exports = router;
