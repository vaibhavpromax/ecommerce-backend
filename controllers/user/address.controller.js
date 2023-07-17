const db = require("../../db/models");
const logger = require("../../utils/logger");
const {
  serverErrorResponse,
  successResponse,
} = require("../../utils/response");

const Address = db.Address;

const getAddressOfUser = async (req, res) => {
  const { user_id } = req.user;
  try {
    const createdObject = await Address.findAll({
      where: {
        user_id: user_id,
      },
    });
    successResponse(res, "Address fetched successfully", createdObject);
  } catch (err) {
    logger.error(`Error while fetching address ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const addAddress = async (req, res) => {
  const { user_id } = req.user;
  try {
    const {
      street_no,
      street_name,
      postal_code,
      city,
      country,
      name_on_address,
    } = req.body;
    const createdObject = await Address.create({
      user_id: user_id,
      street_no: street_no,
      street_name: street_name,
      postal_code: postal_code,
      city: city,
      country: country,
      name_on_address,
    });
    successResponse(res, "Address added successfully", createdObject);
  } catch (err) {
    logger.error(`Error while creating address ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};
const updateAddress = async (req, res) => {
  const { user_id } = req.user;
  const { address_id } = req.params;
  try {
    const {
      street_no,
      street_name,
      postal_code,
      city,
      country,
      name_on_address,
    } = req.body;
    const createdObject = await Address.update(
      {
        street_no: street_no,
        street_name: street_name,
        postal_code: postal_code,
        city: city,
        country: country,
        name_on_address,
      },
      {
        where: {
          user_id: user_id,
          id: address_id,
        },
      }
    );
    successResponse(res, "Address updated successfully", createdObject);
  } catch (err) {
    logger.error(`Error while updating address ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

module.exports = { getAddressOfUser, addAddress, updateAddress };
