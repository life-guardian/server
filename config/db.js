const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", false);

  const databaseName =
    process.env.NODE_ENV === "development" ? "lifeguardiandev" : "lifeguardian";

  await mongoose
    .connect(process.env.MONGO_URI, { dbName: databaseName })
    .then((c) => {
      console.log(
        `Database connected with ${c.connection.host} to ${databaseName}`
      );
    })
    .catch((error) => {
      console.error(`Error in connecting database : ${error}`);
      process.exit(1);
    });
};

module.exports = connectDB;
