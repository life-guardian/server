const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");

dotenv.config();

const app = express();
const server = http.createServer(app);

//socket.io events
const socketIO = require("./utils/socket");
socketIO(server);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const connectDB = require("./config/db");

//routes
const userRoutes = require("./routes/userRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const eventRoutes = require("./routes/eventRoutes");
const alertRoutes = require("./routes/alertRoutes");
const userLocationRoutes = require("./routes/userLocationRoutes");
const historyRoutes = require("./routes/historyRoutes");
const findAgencyRoutes = require("./routes/findAgencyRoutes");

app.use("/api/user", userRoutes); //register, login routes for user
app.use("/api/agency", agencyRoutes); //register , login routes for agency
app.use("/api/event", eventRoutes); //all event routes
app.use("/api/alert", alertRoutes); //send alert, show received alerts
app.use("/api/userlocation", userLocationRoutes); //routes related to users location
app.use("/api/history", historyRoutes); //all history page routes
app.use("/api/search", findAgencyRoutes); //search agencies by agency name or representative name & view details

app.get("/", (req, res) => {
  res.send("<h2>Welcome to LifeGuardian</h2>");
});

const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `Server successfully running on port: ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
});
