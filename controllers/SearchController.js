const { response } = require("express");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { ObjectId } = require("mongoose").Types;

// Allowed search collections
const collectionAllowed = ["users", "category", "product"];

// User search
const searchUser = async (term, res = response) => {
  const isMongoId = ObjectId.isValid(term);

  // If the user provides an ID as a term, return the user by their ID
  if (isMongoId) {
    const user = await User.findById(term);
    return res.status(200).json({ results: user ? [user] : [] });
  }

  const regex = new RegExp(term, "i"); // Regular expression to improve search

  // Search the user by both their name and email
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });

  res.status(200).json({
    results: users,
  });
};

// Category search
const searchCategory = async (term, res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const category = await Category.findById(term);
    return res.status(200).json({ results: category ? [category] : [] });
  }

  const regex = new RegExp(term, "i"); // Regular expression to improve search

  const categories = await Category.find({ name: regex, state: true });

  res.status(200).json({
    results: categories,
  });
};

// Product search
const searchProduct = async (term, res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const product = await Product.findById(term).populate("category", "name");
    return res.status(200).json({ results: product ? [product] : [] });
  }

  const regex = new RegExp(term, "i"); // Regular expression to improve search

  const products = await Product.find({
    $or: [{ name: regex }, { description: regex }],
    $and: [{ state: true }],
  }).populate("categoryId", "name");

  res.status(200).json({
    results: products,
  });
};

const search = (req, res = response) => {
  const { collection, term } = req.params;

  if (!collectionAllowed.includes(collection)) {
    return res.status(400).json({
      msg: `Collection allowed are: ${collectionAllowed}`,
    });
  }

  switch (collection) {
    case "users":
      searchUser(term, res);
      break;

    case "category":
      searchCategory(term, res);
      break;

    case "product":
      searchProduct(term, res);
      break;

    default:
      res.status(500).json("Not defined.");
  }
};

module.exports = search;
