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
    await queryInterface.createTable("Schedulemails", {
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
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("Schedulemails");
  },
};
