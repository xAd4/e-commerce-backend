const express = require("express");
const {
  getProducts,
  getByIdProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/index");

const router = express.Router();

//* User Endpoints
router.get("/", getProducts);
router.get("/:id", getByIdProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
