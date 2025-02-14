const express = require("express");
const { check } = require("express-validator");
const {
  validate,
  idValidator,
  emailExists,
} = require("../middlewares/validate");
const validateJWT = require("../middlewares/validateJWT");
const isAdmin = require("../middlewares/isAdmin");
const hasRole = require("../middlewares/hasRole");

const {
  getUsers,
  getByIdUsers,
  createUsers,
  updateUsers,
  deleteUsers,
} = require("../controllers/UserController");

const router = express.Router();

//* User Endpoints
router.get("/", getUsers);

router.get(
  "/:id",
  [
    check("id").isMongoId().withMessage("Must be Mongo ID"),
    check("id").custom(idValidator),
    validate,
  ],
  getByIdUsers
);

router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("Name is required."),
    check("email").isEmail().withMessage("Must be valid email."),
    check("email").custom(emailExists),
    check("password").not().isEmpty().withMessage("Password is required."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must has 6 characters or more."),
    validate,
  ],
  createUsers
);

router.put(
  "/:id",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    check("id").isMongoId().withMessage("Must be Mongo ID"),
    check("id").custom(idValidator),
    check("email").custom(emailExists),
    validate,
  ],
  updateUsers
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    hasRole("admin", "user"),
    check("id").isMongoId().withMessage("Must be Mongo ID"),
    check("id").custom(idValidator),
    validate,
  ],
  deleteUsers
);

module.exports = router;
