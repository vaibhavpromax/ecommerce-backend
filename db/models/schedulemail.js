"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Schedulemail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: "user_id" });
    }
  }
  Schedulemail.init(
    {
      schedulemail_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      receiver: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      schdeuled_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
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
      modelName: "Schedulemail",
    }
  );
  return Schedulemail;
};
