const db = require("../../db/models");
const logger = require("../../utils/logger");
const {
  serverErrorResponse,
  successResponse,
} = require("../../utils/response");

const User = db.User;
const Address = db.Address;
const Order = db.Order;

const getCompleteUserDetails = async (req, res) => {
  const { user_id } = req.body;
  try {
    const createdObject = await User.findOne({
      where: {
        user_id: user_id,
      },
      include: [
        {
          model: Address,
        },
        {
          model: Order,
        },
      ],
    });
    successResponse(res, "User details fetched successfully", createdObject);
  } catch (err) {
    logger.error(`Error while fetching user details ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const getUserDetails = async (req, res) => {
  const { user_id } = req.user;
  try {
    const user = await User.findOne({
      where: {
        user_id: user_id,
      },
    });
    return successResponse(res, "User details fetched successfully", {
      name: user?.first_name + user?.last_name,
      email: user?.email,
      username: user?.username,
      phone_no: user?.phone_no,
    });
  } catch (err) {
    logger.error(`Error while fetching user details ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const uploadUserImage = async (req, res) => {
  const { user_id } = req.user;

  try {
    const newImage = await Image.create({
      product_id: null,
      image_url: req.file.location,
      user_id,
    });
    return successResponse(res, "User Image uploaded", newImage);
  } catch (error) {
    logger.error(`Error while updating the image table ${error}`);
    return serverErrorResponse(res, "Error while uploading image");
  }
};
const uploadImageController = async (req, res) => {
  try {
    console.log(req.file);
    return successResponse(res, "Image uploaded", req.file.location);
  } catch (error) {
    logger.error(`Error while updating the image table ${error}`);
    return serverErrorResponse(res, "Error while uploading image");
  }
};

const getCustomers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "first_name",
        "last_name",
        "email",
        "user_id",
        "last_ordered",
        "phone_no",
        "createdAt",
      ],
    });
    return successResponse(res, "customers fetched successfully", users);
  } catch (error) {
    logger.error(`Error while fetching customers ${error}`);
    return serverErrorResponse(res, "Error while fetching customers");
  }
};

module.exports = {
  getCompleteUserDetails,
  getUserDetails,
  uploadUserImage,
  getCustomers,
  uploadImageController,
};
