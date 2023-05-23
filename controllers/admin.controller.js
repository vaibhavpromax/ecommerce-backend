const db = require("../db/models");

const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");

const Mail = db.Mail;

const get_emails = async (req, res) => {
  try {
    const emails = await Mail.findAll();
    successResponse(res, "Emails fetched successfully", emails);
  } catch (err) {
    logger.error(`Error while creating email ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

module.exports = {
  get_emails,
};
