const { request, response } = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * Retrieves all carts with pagination.
 *
 * @async
 * @function getCarts
 * @param {express.Request} req - Express request object. Expects query parameters:
 *   - `limit` {number} (optional): Maximum number of carts to retrieve. Defaults to 100.
 *   - `since` {number} (optional): Number of carts to skip for pagination. Defaults to 0.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the total carts count and a list of carts.
 */
const getCarts = async (req = request, res = response) => {
  try {
    const { limit = 100, since = 0 } = req.query;

    const [totalCarts, carts] = await Promise.all([
      Cart.countDocuments(),
      Cart.find().skip(Number(since)).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalCarts,
        carts: carts,
      },
      message: "Carts retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving carts:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve carts",
      error: error.message,
    });
  }
};

/**
 * Retrieves a single cart by its ID.
 *
 * @async
 * @function getByIdCart
 * @param {express.Request} req - Express request object. Expects `req.params.id` to be provided.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the cart data.
 */
const getByIdCart = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id);

    res.status(200).json({
      success: true,
      data: {
        cart: cart,
      },
      message: "Cart retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve cart",
      error: error.message,
    });
  }
};

/**
 * Creates a new cart.
 *
 * @async
 * @function createCart
 * @param {express.Request} req - Express request object. Expects `req.body` to include:
 *   - `userId` {string}: ID of the user creating the cart.
 *   - `productsIds` {Array<string>}: Array of product IDs to add to the cart.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the newly created cart.
 *
 *  @example
 * // POST /carts
 * // req.body = {"userId": "60a6e9bdfeac4c2f5cd0b921", "productsIds": ["60a6ea6ef0ac4c2f5cd0b922","60a6ea7bf0ac4c2f5cd0b923"]
}
 * createCart(req, res);
 */
const createCart = async (req, res) => {
  try {
    const { userId, productsIds } = req.body;

    if (!Array.isArray(productsIds) || productsIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Must provide an array of products.",
      });
    }

    const products = await Product.find({ _id: { $in: productsIds } });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Products with IDs provided not found.",
      });
    }

    const cartProducts = products.map((product) => ({
      productId: product._id,
      quantity: 1,
    }));

    const totalPrice = products.reduce(
      (sum, product) => sum + product.price,
      0
    );

    const newCart = new Cart({ userId, products: cartProducts, totalPrice });
    await newCart.save();

    res.status(201).json({
      success: true,
      data: { cart: newCart },
      message: "Cart created successfully",
    });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create cart",
      error: error.message,
    });
  }
};

/**
 * Updates an existing cart.
 *
 * @async
 * @function updateCart
 * @param {express.Request} req - Express request object. Expects:
 *   - `req.params.id` {string}: ID of the cart to update.
 *   - `req.body` {Object}: Fields to update, including `productsIds` (optional).
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the updated cart.
 */

const updateCart = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { productsIds } = req.body;

    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    let updatedFields = {};

    if (productsIds) {
      if (!Array.isArray(productsIds) || productsIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "productsIds must be a non-empty array.",
        });
      }

      const products = await Product.find({ _id: { $in: productsIds } });

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Some or all products not found.",
        });
      }

      updatedFields.products = products.map((product) => ({
        productId: product._id,
        quantity: 1,
      }));

      updatedFields.totalPrice = products.reduce(
        (sum, product) => sum + product.price,
        0
      );
    }

    const updatedCart = await Cart.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        cart: updatedCart,
      },
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

/**
 * Deletes a cart by ID.
 *
 * @async
 * @function deleteCart
 * @param {express.Request} req - Express request object. Expects `req.params.id` for the cart ID.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response confirming the deletion.
 */
const deleteCart = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await Cart.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCarts,
  getByIdCart,
  createCart,
  updateCart,
  deleteCart,
};
