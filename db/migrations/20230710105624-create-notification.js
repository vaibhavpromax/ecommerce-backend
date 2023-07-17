"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("Notifications", {
      noti_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
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
      other_info: {
        type: Sequelize.STRING,
      },
      for_all: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("Notifications");
  },
};
