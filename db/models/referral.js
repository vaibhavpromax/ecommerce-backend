"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Referral extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
        this.belongsTo(User,{foreignKey:"user_id"})
    }
  }
  Referral.init(
    {
      referral_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      // person who is sending the referral code
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      referr_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isDiscount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // user who is getting the referral code
      referred_to: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: "Referral",
    }
  );
  return Referral;
};
