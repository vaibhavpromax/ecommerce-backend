"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: "user_id" });
    }
  }
  Notification.init(
    {
      noti_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true ,
      },
      noti_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      noti_detail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_seen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      for_all: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      other_info: {
        type: Sequelize.STRING,
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
      modelName: "Notification",
    }
  );
  return Notification;
};
