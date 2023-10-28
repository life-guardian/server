const router = require("express").Router();
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

const {
  agencyRegister,
  agencyLogin,
  agencyLogout,
} = require("../controllers/agency.controller");

router.put(
  "/register",
  [
    check("agencyName", "Agency name length should be 1 to 20 characters")
      .trim()
      .isLength({ min: 1, max: 20 }),
    check("agencyEmail", "Agency email length should be 3 to 30 characters")
      .trim()
      .isEmail()
      .isLength({ max: 30 }),
    check("agencyPhNo", "Mobile number should contains 10 digits")
      .trim()
      .isInt()
      .isLength({ min: 10, max: 10 }),
    check("password", "Password length should be 6 to 20 characters")
      .trim()
      .isLength({ min: 6, max: 20 }),
    check("address", "Address should be 1 to 50 characters")
      .trim()
      .isLength({ min: 1, max: 50 }),
    check(
      "representativeName",
      "Representative name length should be 1 to 30 characters"
    )
      .trim()
      .isLength({ min: 1, max: 30 }),
  ],
  agencyRegister
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
  agencyLogin
);

router.delete("/logout", auth, agencyLogout);

module.exports = router;
