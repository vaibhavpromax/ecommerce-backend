"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // define association here
    static associate({ User, Product, Order }) {
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Product, { foreignKey: "product_id" });
      this.belongsTo(Order, { foreignKey: "order_id" });
    }
  }
  Review.init(
    {
      order_id: {
        type: Sequelize.UUID,
      },
      user_id: {
        type: Sequelize.UUID,
      },
      product_id: {
        type: Sequelize.UUID,
      },
      review_id: {
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      description: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
