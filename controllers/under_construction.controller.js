const db = require("../db/models");
const logger = require("../utils/logger");
const { serverErrorResponse, successResponse } = require("../utils/response");
const Mail = db.Mail;

const add_email = async (req, res) => {
  const { mail } = req.body;

  try {
    const userPresent = await Mail.findOne({
      where: {
        email: mail,
      },
    });

    if (userPresent) return serverErrorResponse(res, "Email already exists");
    const createdObject = await Mail.create({
      email: mail,
    });

    successResponse(res, "Email added successfully", createdObject);
  } catch (err) {
    logger.error(`Error while creating email ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

module.exports = {
  add_email,
};
