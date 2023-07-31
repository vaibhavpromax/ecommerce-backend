"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order, Image, Review, CartItem, Wishlist }) {
      this.hasMany(Order, { foreignKey: "product_id" });
      this.hasMany(Review, { foreignKey: "product_id" });
      this.hasMany(Image, { foreignKey: "product_id" });
      this.hasMany(CartItem, { foreignKey: "product_id" });
      this.hasMany(Wishlist, { foreignKey: "product_id" });
    }
  }
  Product.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      cost_price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      selling_price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      beans_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_length: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_width: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_height: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_weight: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      inventory_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stripe_product_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_discount_percentage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_discount_present: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      discount_value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discount_begin_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      discount_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      stripe_price_id: {
        type: Sequelize.STRING,
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
      modelName: "Product",
    }
  );
  return Product;
};
