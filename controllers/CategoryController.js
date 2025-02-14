const { request, response } = require("express");
const Category = require("../models/Category");

/**
 * Retrieves active categories from the database with pagination.
 *
 * @async
 * @function getCategories
 * @param {express.Request} req - Express request object. Expects query parameters:
 *   - `limit` {number} (optional): Maximum number of categories to retrieve. Defaults to 100.
 *   - `since` {number} (optional): Number of categories to skip for pagination. Defaults to 0.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the total number of active categories and a list of categories.
 *
 * @example
 * // GET /categories?limit=10&since=0
 * getCategories(req, res);
 */
const getCategories = async (req = request, res = response) => {
  try {
    const { limit = 100, since = 0 } = req.query;
    const query = { state: true };

    const [totalCategories, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query).skip(Number(since)).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalCategories,
        categories: categories,
      },
      message: "Categories retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};

/**
 * Retrieves a single Category by its ID.
 *
 * @async
 * @function getByIdCategory
 * @param {express.Request} req - Express request object. Expects `req.params.id` to be provided.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the Category data.
 *
 * @example
 * // GET /categories/uid
 * getByIdCategory(req, res);
 */
const getByIdCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    res.status(200).json({
      success: true,
      data: {
        category: category,
      },
      message: "Category retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving Category:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};

/**
 * Creates a new Category in the database.
 *
 * @async
 * @function createCategory
 * @param {express.Request} req - Express request object. Expects `req.body` to include:
 *   - `name` {string}: The name of the Category.
 *   - `email` {string}: The email of the Category.
 *   - `password` {string}: The password of the Category.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the newly created Category.
 *
 * @example
 * // POST /categories
 * // req.body = { name: 'Category'}
 * createCategory(req, res);
 */
const createCategory = async (req = request, res = response) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({
      success: true,
      data: {
        category: newCategory,
      },
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error create Category:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create Category",
      error: error.message,
    });
  }
};

/**
 * Updates an existing Category's information.
 *
 * @async
 * @function updateCategory
 * @param {express.Request} req - Express request object. Expects:
 *   - `req.params.id` {string}: The ID of the Category to update.
 *   - `req.body` {Object}: An object containing the fields to update. If a new `password` is provided, it will be hashed.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the updated Category data.
 *
 * updateCategory(req, res);
 */
const updateCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!category.state) {
      return res.status(404).json({
        success: false,
        message: "Category blocked can't update his info",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        Category: updatedCategory,
      },
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating Category:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update Category",
      error: error.message,
    });
  }
};

/**
 * Soft deletes a Category by setting its state to false.
 *
 * @async
 * @function deleteCategory
 * @param {express.Request} req - Express request object. Expects `req.params.id` for the Category ID.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response confirming the deletion.
 *
 * @example
 * // DELETE /categories/uid
 * deleteCategory(req, res);
 */
const deleteCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ state: false });

    if (category.state) {
      return res.status(400).json({
        success: false,
        message: "Category is already blocked.",
      });
    }

    const deletedCategory = await Category.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        category: deletedCategory,
      },
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Category:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete Category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getByIdCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
//*
