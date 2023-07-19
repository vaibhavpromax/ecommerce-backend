  "use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order, Review }) {
      this.hasMany(Order, { foreignKey: "product_id" });
      this.hasMany(Review, { foreignKey: "product_id" });
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
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
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
      image: {
        type: Sequelize.STRING,
        allowNull:true
      },
      stripe_product_id: {
        type: Sequelize.STRING,
        allowNull:true
      }, 
      stripe_price_id: {
        type: Sequelize.STRING,
        allowNull:true
      } ,
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
