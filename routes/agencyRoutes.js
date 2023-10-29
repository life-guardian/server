const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");

const { check, validationResult } = require("express-validator");

const {
  agencyRegister,
  agencyLogin,
  agencyLogout,
} = require("../controllers/agency.controller");

router.post(
  "/register",
  [
    check("agencyName", "Agency name length should be 1 to 20 characters")
      .trim()
      .isLength({ min: 1, max: 20 }),
    check("agencyEmail", "Agency email length should be 3 to 50 characters")
      .trim()
      .isEmail()
      .isLength({ max: 50 }),
    check("agencyPhNo", "Mobile number should contains 10 digits")
      .trim()
      .isInt()
      .isLength({ min: 10, max: 10 }),
    check("password", "Password length should be 6 to 20 characters")
      .trim()
      .isLength({ min: 6, max: 20 }),
    check("address", "Address should be 1 to 100 characters")
      .trim()
      .isLength({ min: 1, max: 100 }),
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
    check("username", "Input length should be 3 to 50 characters")
      .trim()
      .isLength({ min: 3, max: 50 }),
    check("password", "Password length should be 6 to 20 characters")
      .trim()
      .isLength({ min: 6, max: 20 }),
  ],
  agencyLogin
);   //username should be either email or phone number

router.delete("/logout", auth, isAgency, agencyLogout);

module.exports = router;
