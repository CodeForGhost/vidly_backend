const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const router = express.Router();

// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Adventure" },
//   { id: 3, name: "Scifi" },
// ];

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
  })
);

async function createGenre(genre) {
  const genreObj = new Genre({
    name: genre.name,
  });
  try {
    const result = await genreObj.save();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

async function getAllGenre() {}

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  return schema.validate(genre);
}

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("The Genre Not Found");
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("The Genre Not Found");

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("The Genre Not Found");

  res.send(genre);
});

module.exports = router;
