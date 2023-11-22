const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const { check, validationResult } = require("express-validator");

const {
  userRegister,
  userLogin,
  userLogout,
} = require("../controllers/user.controller");

router.post(
  "/register",
  [
    check("name", "Name length should be 1 to 100 characters")
      .trim()
      .isLength({ min: 1, max: 100 }),
    check("phoneNumber", "Mobile number should contains 10 digits")
      .trim()
      .isInt()
      .isLength({ min: 10, max: 10 }),
    check("email", "Email length should be 3 to 100 characters")
      .trim()
      .isEmail()
      .isLength({ max: 100 }),
    check("password", "Password length should be 6 to 20 characters")
      .trim()
      .isLength({ min: 6, max: 20 }),
    check("address", "Address should be 1 to 200 characters")
      .trim()
      .isLength({ min: 1, max: 200 }),
  ],
  userRegister
);

router.post(
  "/login",
  [
    check("username", "Username length should be 3 to 100 characters")
      .trim()
      .isLength({ min: 3, max: 50 }),
    check("password", "Password length should be 6 to 20 characters")
      .trim()
      .isLength({ min: 6, max: 20 }),
  ],
  userLogin
);
router.delete("/logout", auth, userLogout);

module.exports = router;
