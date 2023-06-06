"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Order }) {
      this.belongsTo(User, { foreignKey: "user_id" });
      this.hasMany(Order, { foreignKey: "address_id" });
      // define association here
    }
  }
  Address.init(
    {
      address_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      street_no: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      street_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
