"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new columns to the table
    await queryInterface.addColumn("Addresses", "address_phone_no", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Addresses", "address_name", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns
    await queryInterface.removeColumn("Addresses", "address_phone_no");
    await queryInterface.removeColumn("Addresses", "address_name");
  },
};
