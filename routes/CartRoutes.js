const express = require("express");
const {
  getCarts,
  getByIdCart,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/index");

const router = express.Router();

//* User Endpoints
router.get("/", getCarts);
router.get("/:id", getByIdCart);
router.post("/", createCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

module.exports = router;
