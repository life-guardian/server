const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization || socket.handshake.auth.token;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return next(new Error("Missing JWT token"));
    }
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
};

module.exports = socketAuth;
