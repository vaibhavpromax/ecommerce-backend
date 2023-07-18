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

    await queryInterface.createTable("Orders", {
      order_id: {
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      user_id: {
        type: Sequelize.UUID,
      },
      stripe_payment_id: {
        type: Sequelize.UUID,
      },
      address_id: {
        type: Sequelize.UUID,
      },
      total_price: {
        type: Sequelize.STRING,
      },
      discount_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      final_amount: {
        type: Sequelize.STRING,
      },
      order_status: {
        type: Sequelize.STRING,
      },
      cart_id: { type: Sequelize.UUID },
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
    await queryInterface.dropTable("Orders");
  },
};
