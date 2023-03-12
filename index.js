const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

mongoose
  .connect(
    "mongodb+srv://test1234:test1234@cluster0.y6vh7bg.mongodb.net/vidly?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Could not connected to mongodb"));

const app = express();
app.use(bodyParser.json());
app.use("/api/genres/", genres);
app.use("/api/customers/", customers);

app.get("/", (req, res) => {
  res.send("Welcome to Vidly app");
});

app.listen(3000, () => console.log("Listening on 3000...."));
