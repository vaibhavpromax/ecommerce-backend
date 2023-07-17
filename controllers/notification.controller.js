const { Op } = require("sequelize");
const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Notification = db.Notification;

const createNotification = async (req, res) => {
  const { user_id } = req.user;
  const { noti_type, noti_detail, other_info, for_all } = req.body;
  try {
    const notification = Notification.create({
      user_id: for_all ? null : user_id,
      noti_detail,
      noti_type,
      for_all,
      other_info,
    });
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
    const notifications = Notification.findAll({
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
