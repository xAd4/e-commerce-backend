const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * Retrieves active users from the database with pagination.
 *
 * @async
 * @function getUsers
 * @param {express.Request} req - Express request object. Expects query parameters:
 *   - `limit` {number} (optional): Maximum number of users to retrieve. Defaults to 10.
 *   - `since` {number} (optional): Number of users to skip for pagination. Defaults to 0.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the total number of active users and a list of users.
 *
 * @example
 * // GET /users?limit=10&since=0
 * getUsers(req, res);
 */
const getUsers = async (req = request, res = response) => {
  try {
    const { limit = 10, since = 0 } = req.query;
    const query = { state: true };

    const [totalUsers, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(since)).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        users: users,
      },
      message: "Users retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

/**
 * Retrieves a single user by its ID.
 *
 * @async
 * @function getByIdUsers
 * @param {express.Request} req - Express request object. Expects `req.params.id` to be provided.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the user data.
 *
 * @example
 * // GET /users/uid
 * getByIdUsers(req, res);
 */
const getByIdUsers = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      data: {
        users: user,
      },
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

/**
 * Creates a new user in the database.
 *
 * @async
 * @function createUsers
 * @param {express.Request} req - Express request object. Expects `req.body` to include:
 *   - `name` {string}: The name of the user.
 *   - `email` {string}: The email of the user.
 *   - `password` {string}: The password of the user.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the newly created user.
 *
 * @example
 * // POST /users
 * // req.body = { name: 'John Doe', email: 'john@example.com', password: 'password123' }
 * createUsers(req, res);
 */
const createUsers = async (req = request, res = response) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({
      success: true,
      data: {
        user: newUser,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error create user:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

/**
 * Updates an existing user's information.
 *
 * @async
 * @function updateUsers
 * @param {express.Request} req - Express request object. Expects:
 *   - `req.params.id` {string}: The ID of the user to update.
 *   - `req.body` {Object}: An object containing the fields to update. If a new `password` is provided, it will be hashed.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the updated user data.
 *
 * @example
 * // PUT /users/uid
 * // req.body = { name: 'Jane Doe', password: 'newpassword123' }
 * updateUsers(req, res);
 */
const updateUsers = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.state) {
      return res.status(404).json({
        success: false,
        message: "User blocked can't update his info",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

/**
 * Soft deletes a user by setting its state to false.
 *
 * @async
 * @function deleteUsers
 * @param {express.Request} req - Express request object. Expects `req.params.id` for the user ID.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response confirming the deletion.
 *
 * @example
 * // DELETE /users/uid
 * deleteUsers(req, res);
 */
const deleteUsers = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ state: false });

    if (user.state) {
      return res.status(400).json({
        success: false,
        message: "User is already blocked.",
      });
    }

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: deletedUser,
      },
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getByIdUsers,
  createUsers,
  updateUsers,
  deleteUsers,
};
//*
