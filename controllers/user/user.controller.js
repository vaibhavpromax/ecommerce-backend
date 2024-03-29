const db = require("../../db/models");
const { deleteImageFromAWS } = require("../../services/amazon/uploadImage");
const logger = require("../../utils/logger");
const {
  serverErrorResponse,
  successResponse,
} = require("../../utils/response");

const User = db.User;
const Address = db.Address;
const Order = db.Order;
const OrderItem = db.OrderItem;
const Cart = db.Cart;
const Review = db.Review;
const Notification = db.Notification;
const Wishlist = db.Wishlist;
const Image = db.Image;
const Product = db.Product;

const getCompleteUserDetails = async (req, res) => {
  const { user_id } = req.params;
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
          include: {
            model: OrderItem,
            include: {
              model: Product,
              include: {
                model: Image,
              },
            },
          },
        },
      ],
    });
    successResponse(res, "User details fetched successfully", createdObject);
  } catch (err) {
    logger.error(`Error while fetching complete user details ${err.message}`);
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
      profile_pic_url: user?.profile_pic_url,
    });
  } catch (err) {
    logger.error(`Error while fetching user details ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteUsers = async (req, res) => {
  const { id_arr } = req.body;
  try {
    const deletedOrder = await Order.destroy({
      where: {
        user_id: id_arr,
      },
    });
    logger.info(`Order deleted ${deletedOrder}`);
    const deletedCart = await Cart.destroy({
      where: {
        user_id: id_arr,
      },
    });
    logger.info(`Cart deleted ${deletedCart}`);
    const deleteReview = await Review.destroy({
      where: {
        user_id: id_arr,
      },
    });

    logger.info(`Reviews deleted ${deleteReview}`);
    const deleteNotification = await Notification.destroy({
      where: {
        user_id: id_arr,
      },
    });
    logger.info(`Notification deleted ${deleteNotification}`);

    const deleteWishlist = await Wishlist.destroy({
      where: {
        user_id: id_arr,
      },
    });
    logger.info(`Wishlist deleted ${deleteWishlist}`);
    const deletedAddress = await Address.destroy({
      where: {
        user_id: id_arr,
      },
    });
    logger.info(`Address deleted ${deletedAddress}`);
    const deletedUser = await User.destroy({
      where: {
        user_id: id_arr,
      },
    });
    logger.info(`User deleted ${deletedUser}`);
    return successResponse(res, "User details fetched successfully", user);
  } catch (err) {
    logger.error(`Error while deleting user details ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const uploadUserImage = async (req, res) => {
  const { user_id } = req.user;
  // console.log("hello");
  // console.log(req.file);
  try {
    const updateUserImage = await User.update(
      {
        profile_pic_url: req.file.location,
      },
      {
        where: {
          user_id,
        },
      }
    );
    return successResponse(res, "User Image updated", updateUserImage);
  } catch (error) {
    logger.error(`Error while updating the user profile pic ${error}`);
    return serverErrorResponse(res, "Error while updating user profile pic");
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

const deleteImageController = async (req, res) => {
  const { id } = req.params;
  const { image_id } = req.body;
  const msg = await deleteImageFromAWS(id);
  if (msg == "done") {
    try {
      const deleteImage = await Image.destroy({ where: { image_id } });
      logger.info(`Image deleted from table ${deleteImage}`);
    } catch (error) {
      console.log(error);
      return serverErrorResponse(res, "Error while deleting image");
    }
    return successResponse(res, "Image deleted successfully", "done");
  }
  return serverErrorResponse(res, "Error while deleting image");
};

const editImageController = async (req, res) => {
  const url = req.file.location;
  const { id } = req.params;
  const { image_id } = req.body;
  try {
    const msg = await deleteImageFromAWS(id);
    if (msg == "done") {
      const updatedImage = await Image.update(
        { image_url: url },
        {
          where: { image_id },
        }
      );
      logger.info(`Image table updated ${updatedImage}`);
      return successResponse(res, "Image uploaded");
    }
    return serverErrorResponse(res, "Error while deleting image");
  } catch (error) {
    logger.error(`Error while updating the image table ${error}`);
    return serverErrorResponse(res, "Error while uploading image");
  }
};

const attachImageWithProduct = async (req, res) => {
  const url = req.file.location;
  const { product_id, is_primary = false } = req.body;
  try {
    const img = await Image.create({
      product_id: product_id,
      image_url: url,
      user_id: null,
      is_primary: is_primary,
    });
    logger.info(`Image attached  ${img}`);
    return successResponse(res, "Image attached", img);
  } catch (error) {
    logger.error(`Error while attaching image to product ${error}`);
    return serverErrorResponse(res, "Error while attaching image to product");
  }
};

const getCustomers = async (req, res) => {
  // const page = parseInt(req.query.page) || 1; // Page number (default: 1)
  // const pageSize = parseInt(req.query.pageSize) || 10; // Page size (default: 10)

  try {
    const users = await User.findAll({
      attributes: [
        "first_name",
        "last_name",
        "email",
        "user_id",
        "last_ordered",
        "createdAt",
      ],
    });

    const responseObject = {
      item: users,
      // totalItems: count,
      // totalPages: Math.ceil(items.count / pageSize),
      // currentPage: page,
    };

    return successResponse(
      res,
      "customers fetched successfully",
      // responseObject
      users
    );
  } catch (error) {
    logger.error(`Error while fetching customers ${error}`);
    return serverErrorResponse(res, "Error while fetching customers");
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;

  try {
    const udpatedObj = await User.update(
      {
        first_name,
        last_name,
        email,
      },
      {
        where: {
          user_id: id,
        },
      }
    );

    return successResponse(res, "user updated successfully", udpatedObj);
  } catch (error) {
    logger.error(`Errror while updating the user ${error}`);
    return serverErrorResponse(res, "Error while updating user");
  }
};

const toggleCustomerBlockStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { user_id: id } });
    user.is_blocked = !user.is_blocked;
    await user.save();
    logger.info(`User blocked with id ${user_id} change: ${user.is_blocked}`);
    return successResponse(res, "User blocked successfully", user);
  } catch (error) {
    return serverErrorResponse(res, "Error while blocking this user");
  }
};

const checkBlockStatus = async (req, res) => {
  const { user_id } = req.user;

  try {
    const user = await User.findOne({
      where: { user_id },
      attributes: ["is_blocked"],
    });

    logger.info(`fetched status of customer ${user_id}`);
    return successResponse(res, "Fetched the status of customer", user);
  } catch (error) {
    logger.error(`Error while fetching the blocked status ${error}`);
    return serverErrorResponse(res, "Error while fetching the blocked status");
  }
};

module.exports = {
  getCompleteUserDetails,
  getUserDetails,
  uploadUserImage,
  getCustomers,
  deleteUsers,
  deleteImageController,
  uploadImageController,
  editImageController,
  attachImageWithProduct,
  updateUser,
  toggleCustomerBlockStatus,
  checkBlockStatus,
};
