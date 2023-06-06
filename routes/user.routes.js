const express = require("express");
const {
  register,
  login,
  isAuth,
  forgetPassword,
  verifyOTP,
} = require("../controllers/user/auth.controller");
const {
  addAddress,
  getAddressOfUser,
  updateAddress,
} = require("../controllers/user/address.controller");
const {
  getCompleteUserDetails,
} = require("../controllers/user/user.controller");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/add-address", isAuth, addAddress);
router.get("/get-address", isAuth, getAddressOfUser);
router.patch("/update-address/:address_id", isAuth, updateAddress);
router.get("/get-user-info", isAuth, getCompleteUserDetails);

module.exports = router;
