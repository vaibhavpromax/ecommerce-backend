'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('CartItems', {
      cart_item_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey:true,
      }
      ,
      product_id: {
        type: Sequelize.UUID,
        allowNull:false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull:false
      },
      cart_id: {
        type: Sequelize.UUID,
        allowNull:false
      },
      cart_quantity: {
        type: Sequelize.INTEGER,
        defaultValue:1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
