"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Address, Order, Review, Image, Cart }) {
      this.hasMany(Address, { foreignKey: "user_id" });
      this.hasMany(Order, { foreignKey: "user_id" });
      this.hasMany(Review, { foreignKey: "user_id" });
      this.hasMany(Image, { foreignKey: "user_id" });
      this.hasOne(Cart, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone_no: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      stripe_customer_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      referral_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
