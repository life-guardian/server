const app = require("express")();
const jwt = require("jsonwebtoken");

const auth = app.use(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
