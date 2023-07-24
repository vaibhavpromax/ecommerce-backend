const db = require("../db/models");

const logger = require("../utils/logger");
const {
  serverErrorResponse,
  successResponse,
  notFoundResponse,
} = require("../utils/response");

const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;

const addToCart = async (req, res) => {
  const { user_id } = req.user;
  const { product_id, quantity, discount_id = null } = req.body;
  try {
    const cart = await Cart.findOne({
      where: { user_id: user_id },
      include: { CartItem },
    });
    if (cart) {
      const cartitem = await CartItem.findOne({
        where: {
          user_id,
          product_id,
        },
      });
      // check if item already exists in cart
      if (cartitem) {
        // if the quantity is 0 means the item is removed from cart
        if (parseInt(quantity) === 0) {
          try {
            // if the cart had only that item remove the cart
            if (cart.CartItem.length === 1) {
              await cartitem.destroy();
              await cart.destroy();
              return successResponse(res, "Cart updated successfully");
            } else {
              // else only remove the cartitem
              await cartitem.destroy();
              return successResponse(res, "Cart updated successfully");
            }
          } catch (error) {
            logger.error(`error while deleting cartitem ${error}`);
            return serverErrorResponse(res, "Error while updating cart");
          }
        }
        // add the item to cart update the quantity and also update the price of cart total and quantity
        else {
          cartitem.cart_quantity = quantity;
          cartitem.save();
        }
      } else {
        // if cart item does not exist create it
        try {
          const newCartitem = await CartItem.create({
            cart_id: cart.cart_id,
            product_id: product_id,
            cart_quantity: quantity,
            user_id: user_id,
          });
          logger.info(`new cart item created ${newCartitem}` );
          return successResponse(res, "Cart updated successfully", newCartitem);
        } catch (error) {
          logger.info(`error while creating new cart item ${error}`);
          return serverErrorResponse(res, "Error while updating cart");
        }
      }
    } else {
      // if cart does not exist create it
      try {
        const newCart = await Cart.create({
          product_id: product_id,
          user_id: user_id,
          discount_id: discount_id,
        });
        logger.info(`New cart created${newCart}`);

        try {
          const newCartItem = await CartItem.create({
            user_id: user_id,
            cart_quantity: quantity,
            cart_id: newCart.cart_id,
            product_id: product_id,
          });
          logger.info(`New cart item made ${newCartItem}`);
          return successResponse(res, "Cart updated successfully");
        } catch (error) {
          logger.error(`Error while creating cart item ${error}`);
          return serverErrorResponse(res, "Error while updating cart");
        }
      } catch (error) {
        logger.error(`Error while creating new cart ${error}`);
        return serverErrorResponse(res, "Error while updating cart");
      }
    }
  } catch (error) {
    logger.error(`Error while addiing to cart ${error}`);
    return serverErrorResponse(res, "Error while adding to cart");
  }
};

const getCart = async (req, res) => {
  const { user_id } = req.user;
  try {
    const cart = await Cart.findOne({
      where: {
        user_id: user_id,
      },
      include: {
        CartItem,
      },
    });

    const cartitems = cart.CartItem;
    let cart_price, quant;
    if (cart) {
      // get products from the products table
      let cart_arr;
      cart_arr = await cartitems.map(async (item) => {
        const product = await Product.findOne({
          where: {
            product_id: item.product_id,
          },
        });

        if (product) {
          return { price: product.price, quantity: item.cart_quantity };
        } else {
          logger.error(`Product not found for cartitem ${item}`);
          return null;
        }
      });

      // find the total price of the cart
      cart_price = cart_arr.reduce((acc, obj) => {
        acc + obj.price * obj.qunatity;
      }, 0);

      // find the number of unique products in cartm  
      quant = cart_arr.length;

      cart.cart_total = cart_price;
      cart.cart_quantity = quant;

      cart.save();
      return successResponse(res, "Cart fetched successfully", cart);
    } else {
      logger.info(`No cart found for user ${user_id}`);
      return notFoundResponse(res, "No cart found");
    }
  } catch (error) {
    logger.error(`Error fetching cart ${error}`);
    return serverErrorResponse(res, "Error fetching cart", error);
  }
};

module.exports = { addToCart, getCart };




