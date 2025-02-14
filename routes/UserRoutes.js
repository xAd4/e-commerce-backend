const express = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  createUsers,
  getByIdUsers,
  updateUsers,
  deleteUsers,
} = require("../controllers/index");
const { validate, idValidator, emailExists } = require("../middlewares/index");
const isAdmin = require("../middlewares/isAdmin");
const hasRole = require("../middlewares/hasRole");
const validateJWT = require("../middlewares/validateJWT");

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
); //TODO: Allow that admin can do put

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
); //TODO: Allow that admin can do delete

module.exports = router;
