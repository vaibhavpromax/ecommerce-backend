const express = require("express");
const {
  register,
  login,
  authMiddleware,
  forgetPassword,
  verifyOTP,
  changePassword,
  makeSession,
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

router.post("/login", authMiddleware, login);
router.post("/register", authMiddleware, register);
router.post("/forget-password", forgetPassword);
router.get("/get-session", makeSession);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", authMiddleware, changePassword);
router.post("/add-address", authMiddleware, addAddress);
router.get("/get-address", authMiddleware, getAddressOfUser);
router.patch("/update-address", authMiddleware, updateAddress);
router.delete("/delete-address/:address_id", authMiddleware, deleteAddress);
router.get("/get-complete-user-info", authMiddleware, getCompleteUserDetails);
router.get("/get-user-info", authMiddleware, getUserDetails);
router.get("/get-notification", authMiddleware, getNotifications);

module.exports = router;
