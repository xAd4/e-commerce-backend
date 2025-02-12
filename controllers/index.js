//* User Controller
const {
  getUsers,
  createUsers,
  getByIdUsers,
  updateUsers,
  deleteUsers,
} = require("./UserController");

//* Cart Controller
const {
  getCarts,
  getByIdCart,
  createCart,
  updateCart,
  deleteCart,
} = require("./CartController");

//* Category Controller
const {
  getCategories,
  getByIdCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./CategoryController");

//* Product Controller
const {
  getProducts,
  getByIdProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./ProductController");

//* Order Controller
const {
  getOrders,
  getByIdOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("./OrderController");

module.exports = {
  getUsers,
  createUsers,
  getByIdUsers,
  updateUsers,
  deleteUsers,
  getCarts,
  getByIdCart,
  createCart,
  updateCart,
  deleteCart,
  getCategories,
  getByIdCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getByIdProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getByIdOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};
