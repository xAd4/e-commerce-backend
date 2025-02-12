const express = require("express");
const {
  getUsers,
  createUsers,
  getByIdUsers,
  updateUsers,
  deleteUsers,
} = require("../controllers/index");

const router = express.Router();

//* User Endpoints
router.get("/", getUsers);
router.get("/:id", getByIdUsers);
router.post("/", createUsers);
router.put("/:id", updateUsers);
router.delete("/:id", deleteUsers);

module.exports = router;
