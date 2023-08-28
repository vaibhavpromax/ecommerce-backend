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
    static associate({ User, Product, Address, Review, OrderItem }) {
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Product, { foreignKey: "product_id" });
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
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
