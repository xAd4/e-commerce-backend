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
router.get("/:id", getByIdCart); // TODO: Validate that ID is valid
router.post("/", createCart); // TODO: Validate the body
router.put("/:id", updateCart); // TODO: Validate body and ID
router.delete("/:id", deleteCart); // TODO : Validate body and ID

module.exports = router;
