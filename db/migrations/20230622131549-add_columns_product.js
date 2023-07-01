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

    await queryInterface.addColumn("Products", "discount_present", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
    await queryInterface.addColumn("Products", "is_percentage", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
    await queryInterface.addColumn("Products", "discount_value", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Products", "discount_present");
    await queryInterface.removeColumn("Products", "is_percentage");
    await queryInterface.removeColumn("Products", "discount_value");
  },
};
