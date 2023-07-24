const express = require("express");
const {
  register,
  login,
  isAuth,
  forgetPassword,
  verifyOTP,
  changePassword,
} = require("../controllers/user/auth.controller");
const {
  addAddress,
  getAddressOfUser,
  updateAddress,
  deleteAddress,
} = require("../controllers/user/address.controller");
const {
  getCompleteUserDetails,
  getUserDetails,
} = require("../controllers/user/user.controller");
const { getNotifications } = require("../controllers/notification.controller");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", isAuth, changePassword);
router.post("/add-address", isAuth, addAddress);
router.get("/get-address", isAuth, getAddressOfUser);
router.patch("/update-address", isAuth, updateAddress);
router.delete("/delete-address/:address_id", isAuth, deleteAddress);
router.get("/get-complete-user-info", isAuth, getCompleteUserDetails);
router.get("/get-user-info", isAuth, getUserDetails);
router.get("/get-notification", isAuth, getNotifications);

module.exports = router;
