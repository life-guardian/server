const app = require("express")();
const jwt = require("jsonwebtoken");

const auth = app.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in auth middleware: ${error}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = auth;
