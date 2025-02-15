const { request, response } = require("express");
const Product = require("../models/Product");

/**
 * Retrieves active Products from the database with pagination.
 *
 * @async
 * @function getProducts
 * @param {express.Request} req - Express request object. Expects query parameters:
 *   - `limit` {number} (optional): Maximum number of Products to retrieve. Defaults to 100.
 *   - `since` {number} (optional): Number of Products to skip for pagination. Defaults to 0.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the total number of active Products and a list of Products.
 *
 * @example
 * // GET /products?limit=10&since=0
 * getProducts(req, res);
 */
const getProducts = async (req = request, res = response) => {
  try {
    const { limit = 100, since = 0 } = req.query;
    const query = { state: true };

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).skip(Number(since)).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalProducts,
        products: products,
      },
      message: "Products retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving Products:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve Products",
      error: error.message,
    });
  }
};

/**
 * Retrieves a single Product by its ID.
 *
 * @async
 * @function getByIdProduct
 * @param {express.Request} req - Express request object. Expects `req.params.id` to be provided.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the Product data.
 *
 * @example
 * // GET /products/uid
 * getByIdProduct(req, res);
 */
const getByIdProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.status(200).json({
      success: true,
      data: {
        product: product,
      },
      message: "Product retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving Product:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve Products",
      error: error.message,
    });
  }
};

/**
 * Creates a new Product in the database.
 *
 * @async
 * @function createProduct
 * @param {express.Request} req - Express request object. Expects `req.body` to include:
 *   - `name` {string}: The name of the Product.
 *   - `email` {string}: The email of the Product.
 *   - `password` {string}: The password of the Product.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the newly created Product.
 *
 * @example
 * // POST /Products
 * // req.body = { name: 'Product', description: 'lorem ipsum', price: '123', stock: '5', categoryId: 'uid' }
 * createProduct(req, res);
 */
const createProduct = async (req = request, res = response) => {
  try {
    const { userId, name, description, price, stock, categoryId } = req.body;
    const newProduct = new Product({
      userId,
      name,
      description,
      price,
      stock,
      categoryId,
    });
    await newProduct.save();
    res.status(201).json({
      success: true,
      data: {
        product: newProduct,
      },
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error create Product:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create Product",
      error: error.message,
    });
  }
};

/**
 * Updates an existing Product's information.
 *
 * @async
 * @function updateProduct
 * @param {express.Request} req - Express request object. Expects:
 *   - `req.params.id` {string}: The ID of the Product to update.
 *   - `req.body` {Object}: An object containing the fields to update. If a new `password` is provided, it will be hashed.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the updated Product data.
 *
 * updateProduct(req, res);
 */
const updateProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const product = await Product.findById(id);

    console.log("product.user:", product.userId.toString());
    console.log("req.user._id:", req.userAuthenticated._id.toString());

    if (product.userId.toString() !== req.userAuthenticated._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this product",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.state) {
      return res.status(404).json({
        success: false,
        message: "Product blocked can't update his info",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        Product: updatedProduct,
      },
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating Product:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update Product",
      error: error.message,
    });
  }
};

/**
 * Soft deletes a Product by setting its state to false.
 *
 * @async
 * @function deleteProduct
 * @param {express.Request} req - Express request object. Expects `req.params.id` for the Product ID.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response confirming the deletion.
 *
 * @example
 * // DELETE /products/uid
 * deleteProduct(req, res);
 */
const deleteProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    console.log("product.user:", product.userId.toString());
    console.log("req.user._id:", req.userAuthenticated._id.toString());

    if (product.userId.toString() !== req.userAuthenticated._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this product",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        product: deletedProduct,
      },
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Product:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete Product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getByIdProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
//*
