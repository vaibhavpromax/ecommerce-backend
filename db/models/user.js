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
      profile_pic_url: {
        type: Sequelize.TEXT,
        defaultValue:
          "https://ecommerce-images.s3.ap-south-1.amazonaws.com/user.png",
        allowNull: true,
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: function () {
          return this.isGoogleAuthUser;
        },
      },
      isGoogleAuthUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      last_ordered: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      number_of_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
