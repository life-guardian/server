const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const connectDB = require("./config/db");
connectDB();

//routes
const userRoutes = require("./routes/userRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/user", userRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/event", eventRoutes);

app.get("/", (req, res) => {
  res.send("<h2>Welcome to LifeGuardian</h2>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server successfully running on port: ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
