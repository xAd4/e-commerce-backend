const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models/index");

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

const deleteUsers = async (req = request, res = response) => {
  try {
    const { id } = req.params;

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
