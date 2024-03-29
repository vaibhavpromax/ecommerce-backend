const express = require("express");
const {
  get_emails,
  fetch_admin_details,
} = require("../../controllers/admin.controller");
const {
  createNotification,
} = require("../../controllers/notification.controller");

const {
  adminAuthMiddleware,
  login_admin,
  register_admin,
  changeAdminPassword,
} = require("../../controllers/admin/adminauth.controller");

const { uploadImage } = require("../../services/amazon/uploadImage");
const {
  createProduct,
  getProductsForAdmin,
  deleteProducts,
  updateProduct,
} = require("../../controllers/product.controller");
const {
  getCompleteUserDetails,
  getCustomers,
  uploadImageController,
  deleteUsers,
  deleteImageController,
  editImageController,
  attachImageWithProduct,
  updateUser,
  toggleCustomerBlockStatus,
} = require("../../controllers/user/user.controller");
const {
  get_all_orders,
  getOrderDetailsForAdmin,
  get_orders_of_user,
  update_order,
} = require("../../controllers/order.controller");
const { delete_review } = require("../../controllers/review.controller");
const {
  updateAddressForOrder,
} = require("../../controllers/user/address.controller");

const router = express.Router();

router.get("/get_emails", get_emails);
router.get("/get-complete-user-info/:user_id", getCompleteUserDetails);
router.get("/get-customers", getCustomers);
router.post("/delete-customers", deleteUsers);
router.patch("/block-customer/:id", toggleCustomerBlockStatus);

router.post("/notification/create", createNotification);
router.post("/add-image", uploadImage.single("image"), uploadImageController);
router.post("/add-product", createProduct);
router.post("/delete-product", deleteProducts);
router.patch("/update-product/:product_id", updateProduct);
router.patch("/update-address/:id", updateAddressForOrder);
router.patch("/update-user/:id", updateUser);
router.post("/delete-image/:id", deleteImageController);
router.post(
  "/edit-image/:id",
  uploadImage.single("image"),
  editImageController
);
router.post(
  "/attach-image",
  uploadImage.single("image"),
  attachImageWithProduct
);

router.get("/get-products", getProductsForAdmin);

router.get("/get-all-orders", get_all_orders);
router.get("/get-order-details/:id", getOrderDetailsForAdmin);
router.get("/get-customer-orders/:id", get_orders_of_user);
router.delete("/delete-review/:review_id", delete_review);
router.patch("/update-order/:order_id", update_order);

router.post("/login", login_admin);
router.post("/register", register_admin);
router.get("/get-admin-info", adminAuthMiddleware, fetch_admin_details);
router.post("/change-admin-pass", adminAuthMiddleware, changeAdminPassword);

module.exports = router;
