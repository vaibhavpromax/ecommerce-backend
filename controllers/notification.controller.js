const { Op } = require("sequelize");
const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Notification = db.Notification;

const createNotification = async (req, res) => {
  // const { user_id } = req.user;
  // console.log(user_id);
  console.log("first");
  // type is user or system
  const { noti_type, noti_detail, other_info, for_all } = req.body;
  try {
    const notification = await Notification.create({
      user_id: for_all ? null : user_id,
      noti_detail,
      noti_type,
      for_all,
      other_info,
    });

    logger.info("Notification created successfully", notification);
    return successResponse(
      res,
      "Notification created successfully",
      notification
    );
  } catch (err) {
    logger.error("Error while creating notification", err);
    return serverErrorResponse(res, "Error while creating notification");
  }
};

const getNotifications = async (req, res) => {
  const { user_id } = req.user;
  try {
    const notifications = await Notification.findAll({
      where: {
        [Op.or]: [
          {
            user_id: user_id,
          },
          {
            user_id: null,
          },
        ],
      },
    });
    logger.info("Notifications fetched", notifications);
    return successResponse(
      res,
      "Notifications fetched succcessfully",
      notifications
    );
  } catch (err) {
    logger.error("Error while fetching notifications", err);
    return serverErrorResponse(res, "Error while fetching");
  }
};

module.exports = { createNotification, getNotifications };
