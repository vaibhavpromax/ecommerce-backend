"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Cart, Product }) {
      // define association here
      this.belongsTo(Product, { foreignKey: "product_id" });
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Cart, { foreignKey: "cart_id" });
    }
  }
  CartItem.init(
    {
      cart_item_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      cart_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      cart_id: {
        type: Sequelize.UUID,
        allowNull: false,
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
      modelName: "CartItem",
    }
  );
  return CartItem;
};
