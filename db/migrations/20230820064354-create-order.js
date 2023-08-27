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
      total_discount: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      final_amount: {
        type: Sequelize.STRING,
      },
      order_status: {
        type: Sequelize.ENUM(
          "PLACED",
          "PROCESSING",
          "DISPATCHED",
          "SHIPPED",
          "DELIVERED"
        ),
      },
      cart_id: { type: Sequelize.UUID },
      processing_date: { type: Sequelize.DATE },
      shipped_date: { type: Sequelize.DATE },
      delivered_date: { type: Sequelize.DATE },
      order_placed_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      shipping_price: {
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
