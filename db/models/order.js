"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // define association here
    static associate({ User, Product, Address, Review }) {
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Product, { foreignKey: "product_id" });
      this.belongsTo(Address, { foreignKey: "address_id" });
      this.hasOne(Review, { foreignKey: "order_id" });
    }
  }
  Order.init(
    {
      order_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
      },
      product_id: {
        type: Sequelize.UUID,
      },
      payment_id: {
        type: Sequelize.UUID,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      address_id: {
        type: Sequelize.UUID,
      },
      total_price: {
        type: Sequelize.STRING,
      },
      order_status: {
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
