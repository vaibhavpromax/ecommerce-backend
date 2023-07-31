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
    await queryInterface.createTable("Carts", {
      cart_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      cart_total: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "0",
      },
      cart_quantity: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      session_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      discount_id: {
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
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("Carts");
  },
};
