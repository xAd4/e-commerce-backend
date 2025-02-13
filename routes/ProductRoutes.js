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
router.get("/:id", getByIdProduct); // TODO: Validate ID is valid
router.post("/", createProduct); // TODO: Validate the body
router.put("/:id", updateProduct); // TODO: Validate body and ID
router.delete("/:id", deleteProduct); // TODO : Validate body and ID
module.exports = router;
