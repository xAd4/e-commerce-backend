const express = require("express");

const {
  getOrders,
  getByIdOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/OrderController");

const router = express.Router();

//* User Endpoints
router.get("/", getOrders);
router.get("/:id", getByIdOrder);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
