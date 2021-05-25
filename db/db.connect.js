const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function initializeDBConnection() {
  // Connecting to DB
  const uri = process.env.NODE_ENV_DB;
  try {
    await mongoose
      .connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
      .then(() => console.log("successfully connected"));
  } catch (err) {
    console.log("error connecting to db", err);
  }
}

module.exports = { initializeDBConnection };
