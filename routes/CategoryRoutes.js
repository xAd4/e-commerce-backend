const express = require("express");
const {
  getCategories,
  getByIdCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/index");

const router = express.Router();

//* User Endpoints
router.get("/", getCategories);
router.get("/:id", getByIdCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
