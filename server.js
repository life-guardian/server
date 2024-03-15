const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const server = http.createServer(app);

//socket.io events
const socketIO = require("./socket/socket");
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
const rescueOpsRoutes = require("./routes/rescueOpsRoutes");

app.use("/api/user", userRoutes); //register, login routes for user
app.use("/api/agency", agencyRoutes); //register , login routes for agency
app.use("/api/event", eventRoutes); //all event routes
app.use("/api/alert", alertRoutes); //send alert, show received alerts
app.use("/api/userlocation", userLocationRoutes); //routes related to users location
app.use("/api/history", historyRoutes); //all history page routes
app.use("/api/search", findAgencyRoutes); //search agencies by agency name or representative name & view details
app.use("/api/rescueops", rescueOpsRoutes); //start rescue operation

app.get("/", (req, res) => {
  res.send(`
  <div style="text-align: center; margin-top: 20%; width: 100%; font-family: monospace;">
    <h2>Welcome to LifeGuardian!</h2>
    <h3>This is API base url. Please install mobile app.</h3>
  </div>
`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "status is OK😊!" });
});

app.get("/*", (req, res) => {
  res.send(`
  <div style="text-align: center; margin-top: 15%; font-family: monospace;">
  <h3>Hey its your LifeGuardian!</h3>
  <br><br>
  <h2>Your requested endpoint does not exist.</h2>
  <br>
  <h1>Error: 404</h1>
</div>`);
});

const PORT = process.env.PORT || 6000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `LifeGuardian-Server successfully started on port: ${PORT} in ${process.env.NODE_ENV} mode at ${Date.now()}`
    );
  });
});
