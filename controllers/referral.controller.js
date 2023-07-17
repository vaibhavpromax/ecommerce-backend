const db = require("../db/models");
const coupongenerator = require("../helpers/createDiscountCode");
const redisHelper = require("../helpers/redis");

const logger = require("../utils/logger");
const generateRedisKeyNames = require("../utils/rediskeynames");
const {
  serverErrorResponse,
  successResponse,
  notFoundResponse,
} = require("../utils/response");

const Referral = db.Referral;

const createReferral = async (req, res) => {
  const { user_id } = req.user_id;
  const { isDiscount, value } = req.body;
  const referral_code = coupongenerator();
  try {
    const [setRefrralCode, setCodeError] = await redisHelper.setValue(
      generateRedisKeyNames.referralCode(referral_code)
    );
    if (setCodeError)
      return serverErrorResponse(res, "Error in saving code");

    const referral =await Referral.create({
      user_id,
      referr_code: referral_code,
      isDiscount,
      value,
    });
    return successResponse(res, "Referral created successfully", referral);
  } catch (err) {
    logger.error("Error in creating referral", err);
    return serverErrorResponse(res, "Error in creating referral", err);
  }
};

const checkReferral = async (req, res) => {
  const { ref_code } = req.body;
  try {
    const [redisValue, redisError] = await redisHelper.getValue(generateRedisKeyNames.referralCode(ref_code))
    
    if (redisError) {
      logger.error("Error while checking referral code in redis" , redisError)
      return serverErrorResponse(res, "Error while checking referral")}

    if (redisValue === null) {
      logger.info("Referral code not present")
      return notFoundResponse(res, "Referral Code not present")}
    
  } catch (error) {
    logger.error("Error in applying referral", error);
    return serverErrorResponse(res, "Error in applying referral");
  }
};

module.exports = { createReferral , checkReferral };
