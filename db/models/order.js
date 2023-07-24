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
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
