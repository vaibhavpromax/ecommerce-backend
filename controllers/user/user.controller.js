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
  const { user_id } = req.user;
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




module.exports = { getCompleteUserDetails };
