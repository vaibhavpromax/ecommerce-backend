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
const Image = db.Image;

const addToCart = async (req, res) => {
  const { user_id, session_id } = req.user;
  console.log(user_id);
  const { product_id, quantity, discount_id = null } = req.body;
  let cart_params, cart_item_params;
  if (user_id) {
    cart_params = { user_id: user_id };
    cart_item_params = { user_id: user_id, product_id: product_id };
  }
  if (session_id) {
    cart_params = { session_id: session_id };
    cart_item_params = { session_id: session_id, product_id: product_id };
  }

  try {
    let cart;
    cart = await Cart.findOne({
      where: cart_params,
      include: CartItem,
    });
    logger.info(`Cart found for ${cart_params}`);

    if (cart) {
      const cartitem = await CartItem.findOne({
        where: cart_item_params,
      });
      // check if item already exists in cart
      if (cartitem) {
        // if the quantity is 0 means the item is removed from cart
        if (parseInt(quantity) === 0) {
          try {
            // if the cart had only that item remove the cart
            if (cart.dataValues.CartItems.length === 1) {
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
        } else {
          // add the item to cart update the quantity and also update the price of cart total and quantity
          cartitem.cart_quantity = quantity;
          cartitem.save();
          return successResponse(res, "Cart quantity updated");
        }
      } else {
        // if cart item does not exist create it

        let new_cart_item_params;

        if (user_id) {
          new_cart_item_params = {
            cart_id: cart.cart_id,
            product_id: product_id,
            cart_quantity: quantity,
            user_id: user_id,
          };
        }
        if (session_id) {
          new_cart_item_params = {
            cart_id: cart.cart_id,
            product_id: product_id,
            cart_quantity: quantity,
            session_id: session_id,
          };
        }

        try {
          const newCartitem = await CartItem.create(new_cart_item_params);
          logger.info(`new cart item created ${new_cart_item_params}`);
          return successResponse(res, "Cart updated successfully", newCartitem);
        } catch (error) {
          logger.info(`error while creating new cart item ${error}`);
          return serverErrorResponse(res, "Error while updating cart");
        }
      }
    } else {
      // if cart does not exist create it
      let new_cart_params, new_cart_item;

      if (user_id) {
        new_cart_params = {
          user_id: user_id,
          discount_id: discount_id,
        };
      }
      if (session_id) {
        new_cart_params = {
          session_id: session_id,
          discount_id: discount_id,
        };
      }
      try {
        const newCart = await Cart.create(new_cart_params);
        logger.info(`New cart created for ${new_cart_params}`);
        logger.info(`New cart created${newCart}`);

        if (user_id) {
          new_cart_item = {
            user_id: user_id,
            cart_quantity: quantity,
            cart_id: newCart.cart_id,
            product_id: product_id,
          };
        }
        if (session_id) {
          new_cart_item = {
            session_id: session_id,
            cart_quantity: quantity,
            cart_id: newCart.cart_id,
            product_id: product_id,
          };
        }

        try {
          const newCartItem = await CartItem.create(new_cart_item);
          logger.info(`New cart item made for ${new_cart_item}`);
          logger.info(`New cart item made and new Cart made ${newCartItem}`);
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
  const { user_id, session_id } = req.user;

  let get_cart_params;
  if (user_id) get_cart_params = { user_id: user_id };
  if (session_id) get_cart_params = { session_id: session_id };

  try {
    const cart = await Cart.findOne({
      where: get_cart_params,
      include: {
        model: CartItem,
        include: {
          model: Product,
          include: Image,
        },
      },
    });

    if (cart === null) {
      return successResponse(res, "Cart empty", cart);
    }
    const cartitems = cart.CartItems;
    let cart_price = 0,
      quant;

    if (cart) {
      // get products from the products table

      let cart_arr;
      cart_arr = cartitems?.map((it) => {
        const item = it.dataValues;
        const product = item.Product.dataValues;

        if (product) {
          return {
            price: product.selling_price,
            quantity: item.cart_quantity,
          };
        } else {
          logger.error(`Product not found for cartitem ${item}`);
          return null;
        }
      });
      // find the total price of the cart
      cart_price = cart_arr.reduce((acc, obj) => {
        return acc + obj.price * parseInt(obj.quantity);
      }, 0);

      console.log(cart_arr);

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
