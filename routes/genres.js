const express = require('express');
const router = express.Router();



const genres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Scifi" },
]

router.get("/", (req, res) => {
    res.send(genres);
})

router.post("/", (req, res) => {

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre);
    res.send(genre);
})

function validateGenre(genre) {
    const schema = Joi.object({ name: Joi.string().min(3).required() });
    return schema.validate(genre);
}

router.get("/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The Genre Not Found");
    res.send(genre);
})

router.put("/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The Genre Not Found");

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error);

    genre.name = req.body.name;

    res.send(genre);
})

router.delete("/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The Genre Not Found");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
})

module.exports = router;