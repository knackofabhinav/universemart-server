const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const { initializeDBConnection } = require("./db/db.connect");
const productlisting = require("./routers/productlisting.router");
const user = require("./routers/user.router");
app.use(express.json());
app.use(cors());


initializeDBConnection();

app.get("/", (req, res) => {
  res.send("API For E-Commerce App");
});

app.use("/productlisting", productlisting);
app.use("/user", user);

//  404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false });
});

/**
 * Error Handler
 * Don't move
 */
 app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "error occured, see the errMessage key for more details",
    errorMessage: err.message,
  });
});

app.listen(port, () => {
  console.log(`Express App is Listening at http://localhost:${port}`);
});
