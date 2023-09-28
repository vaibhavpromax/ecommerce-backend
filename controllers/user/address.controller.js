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
  let primary = false;
  try {
    const fetchAddress = await Address.findAll({ where: { user_id } });
    if (fetchAddress.length === 0) primary = true;

    const {
      street_no,
      street_name,
      postal_code,
      city,
      country,
      name_on_address,
      address_name,
      address_phone_no,
    } = req.body;
    const createdObject = await Address.create({
      user_id: user_id,
      street_no: street_no,
      street_name: street_name,
      postal_code: postal_code,
      city: city,
      country: country,
      is_primary: primary,
      name_on_address,
      address_name,
      address_phone_no,
    });
    successResponse(res, "Address added successfully", createdObject);
  } catch (err) {
    logger.error(`Error while creating address ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const updateAddressForOrder = async (req, res) => {
  const { id } = req.params;
  const {
    street_no,
    street_name,
    postal_code,
    city,
    country,
    name_on_address,
    address_phone_no,
  } = req.body;
  try {
    const createdObject = await Address.update(
      {
        street_no: street_no,
        street_name: street_name,
        postal_code: postal_code,
        city: city,
        country: country,
        address_phone_no,
        name_on_address,
      },
      {
        where: {
          address_id: id,
        },
      }
    );
    successResponse(res, "Address updated successfully", createdObject);
  } catch (err) {
    logger.error(`Error while updating address ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const updateAddress = async (req, res) => {
  const { user_id } = req.user;
  const {
    street_no,
    street_name,
    postal_code,
    city,
    country,
    is_primary,
    address_id,
    name_on_address,
  } = req.body;
  try {
    if (is_primary) {
      // set all addreses to be not primary
      const updateAddress = await Address.update(
        { is_primary: false },
        { where: { user_id } }
      );
      logger.info(`Addresses marked not primary ${updateAddress}`);
    }

    const createdObject = await Address.update(
      {
        street_no: street_no,
        street_name: street_name,
        postal_code: postal_code,
        city: city,
        is_primary,
        country: country,
        name_on_address,
      },
      {
        where: {
          address_id: address_id,
        },
      }
    );
    successResponse(res, "Address updated successfully", createdObject);
  } catch (err) {
    logger.error(`Error while updating address ${err.message}`);
    serverErrorResponse(res, err.message);
  }
};

const deleteAddress = async (req, res) => {
  const { user_id } = req.user;
  const { address_id } = req.params;
  try {
    const addresses = await Address.findAll({ where: { user_id } });
    const deleteObj = await Address.findOne({ where: { address_id } });

    if (deleteObj.is_primary && addresses.length > 1) {
      // delete the current address
      await deleteObj.destroy();
      // set another address as primary
      const address = await Address.findOne({ where: { user_id } });
      address.is_primary = true;
      await address.save();
    } else {
      await deleteObj.destroy();
    }
    return successResponse(res, "Address deleted successfully");
  } catch (error) {
    logger.error(`Error while deleting address ${error} `);
    return serverErrorResponse(res, "Error while deleting address");
  }
};

module.exports = {
  getAddressOfUser,
  addAddress,
  updateAddress,
  deleteAddress,
  updateAddressForOrder,
};
