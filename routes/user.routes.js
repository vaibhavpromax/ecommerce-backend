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
  uploadUserImage,
  uploadImageController,
} = require("../controllers/user/user.controller");
const { getNotifications } = require("../controllers/notification.controller");
const uploadImage = require("../services/amazon/uploadImage");
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
router.get("/get-user-info", authMiddleware, getUserDetails);
router.get("/get-notification", authMiddleware, getNotifications);
router.post("/upload-user-pic", uploadImage.single("image"), uploadUserImage);

router.post(
  "/upload-image",
  uploadImage.single("image"),
  uploadImageController
);

module.exports = router;
