const express = require('express');
const Joi = require('joi');
const bodyParser = require('body-parser');
const genres = require('./routes/genres');

const app = express();
app.use(bodyParser.json());
app.use("/api/genres/", genres);

app.get("/", (req, res) => {
    res.send("Welcome to Vidly app");
})

app.listen(3000, () => console.log("Listening on 3000...."));