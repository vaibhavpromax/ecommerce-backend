const db = require("../../db/models");
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
const Product = db.Product;
const Image = db.Image;


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
                model:Image
              }   
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
      phone_no: user?.phone_no,
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
        "phone_no",
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

module.exports = {
  getCompleteUserDetails,
  getUserDetails,
  uploadUserImage,
  getCustomers,
  deleteUsers,
  uploadImageController,
};
