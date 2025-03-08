const express = require("express");
const { json } = require("body-parser");
const authMiddleware = require("./src/middlewares/auth.middleware");
require("express-async-errors");
require("dotenv").config();

if (!process.env.API_KEY) {
  console.log("API_KEY secret is missing");
  process.exit();
}
const app = express();

app.use(json());
app.use(authMiddleware);

app.use("/restiky", require("./src/routes/restaurant.route"));
app.use("/public", require("./src/routes/public.route"));

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.send({ message: error.message || "An unknown error occured!" });
});
app.use((req, res, next) => {
  res.status(404).send({ message: "No route found!" });
});
app.listen(process.env.PORT, () => {
  console.log(`Up and listening on port ${process.env.PORT}.`);
});
