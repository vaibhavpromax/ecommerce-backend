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
    static associate({ User, Address, Review, OrderItem }) {
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Address, { foreignKey: "address_id" });
      this.hasOne(Review, { foreignKey: "order_id" });
      this.hasMany(OrderItem, { foreignKey: "order_id" });
    }
  }
  Order.init(
    {
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
          "CREATED", //order is created
          "PLACED", // order is placed when the payment in confirmed
          "PROCESSING", // Order is marked processing by owner
          "SHIPPED", //Order is shipped
          "DELIVERED", // Order in hand of the customer
          "CANCELLED"
        ),
        defaultValue: "CREATED",
      },
      payment_status: {
        type: Sequelize.ENUM(
          "UNPAID", //order is created , payment iniitiated
          "PAID", // order is confimrmed , payment is completed
          "CANCELLED", // Order is marked processing by owner
          
        ),
        defaultValue: "UNPAID",
      },
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
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
