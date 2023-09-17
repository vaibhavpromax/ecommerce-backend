const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Mail = db.Mail;
const Admin = db.Admin;

const get_emails = async (req, res) => {
  try {
    const emails = await Mail.findAll();
    successResponse(res, "Emails fetched successfully", emails);
  } catch (err) {
    logger.error(`Error while creating email ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const fetch_admin_details = async (req, res) => {
  const { admin_id } = req.admin;
  try {
    const admin = await Admin.findOne({
      where: {
        admin_id: admin_id,
      },
    });
    return successResponse(res, "User details fetched successfully", {
      name: admin?.first_name + admin?.last_name,
      email: admin?.email,
    });
  } catch (err) {
    logger.error(`Error while fetching user details ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

module.exports = {
  get_emails,
  fetch_admin_details,
};
