const express = require("express");
const { get_emails } = require("../../controllers/admin.controller");
const {
  createNotification,
} = require("../../controllers/notification.controller");

const {
  adminAuthMiddleware,
  login_admin,
  register_admin,
} = require("../../controllers/admin/adminauth.controller");

const uploadImage = require("../../services/amazon/uploadImage");
const {
  createProduct,
  getProductsForAdmin,
} = require("../../controllers/product.controller");
const {
  getCompleteUserDetails,
  getCustomers,
  uploadImageController,
} = require("../../controllers/user/user.controller");

const router = express.Router();

router.get("/get_emails", get_emails);
router.get("/get-complete-user-info", getCompleteUserDetails);
router.get("/get-customers", getCustomers);
router.post("/notification/create", createNotification);
router.post("/add-image", uploadImage.single("image"), uploadImageController);
router.post("/add-product", createProduct);
router.get("/get-products", getProductsForAdmin);
router.post("/login", login_admin);
router.post("/register", register_admin);

module.exports = router;
