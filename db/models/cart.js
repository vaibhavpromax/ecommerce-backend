"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Order, CartItem, Discount }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id" });
      this.hasOne(Order, { foreignKey: "cart_id" });
      this.hasMany(CartItem, { foreignKey: "cart_id" });
      this.belongsTo(Discount, { foreignKey: "discount_id" });
    }
  }
  Cart.init(
    {
      cart_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      discount_id: {
        type: Sequelize.UUID,
        allowNull: true,
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
      modelName: "Cart",
    }
  );
  return Cart;
};
