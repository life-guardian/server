const router = require("express").Router();
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

const {
  userRegister,
  userLogin,
  userLogout,
} = require("../controllers/user.controller");

router.put(
  "/register",
  [
    check("name", "Name length should be 1 to 20 characters")
      .trim()
      .isLength({ min: 1, max: 20 }),
    check("phoneNumber", "Mobile number should contains 10 digits")
      .trim()
      .isInt()
      .isLength({ min: 10, max: 10 }),
    check("email", "Email length should be 3 to 30 characters")
      .trim()
      .isEmail()
      .isLength({ max: 30 }),
    check("password", "Password length should be 6 to 20 characters")
      .trim()
      .isLength({ min: 6, max: 20 }),
    check("address", "address should be 1 to 50 characters")
      .trim()
      .isLength({ min: 1, max: 50 }),
  ],
  userRegister
);

router.post(
  "/login",
  [
    check("email", "Email length should be 3 to 30 characters")
      .trim()
      .isEmail()
      .isLength({ max: 30 }),
    check("password", "Password length should be 6 to 20 characters")
      .trim()
      .isLength({ min: 6, max: 20 }),
  ],
  userLogin
);
router.delete("/logout", auth, userLogout);

module.exports = router;
