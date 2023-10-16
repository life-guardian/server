const app = require("express")();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = app.use(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const isPresent = await User.findById(user.id);
      if (!isPresent) {
        return res.status(401).json({ message: "Invalid user" });
      }
      req.user = user;
    } else {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    next();
  } catch (error) {
    console.error(`Error in auth middleware: ${error}`);
    return res.status(401).json({ message: "Unauthorized user" });
  }
});

module.exports = auth;
