const express = require("express");
const mongoose = require("mongoose");
// const Fawn = require("fawn");

const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

const router = express.Router();

// Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //   const rental = await Rental.create([], { session: session });
    //   const movie = await Movie.create([], { session: session });
    rental = await rental.save({ session: session });
    movie.numberInStock--;
    await movie.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.status(500).send("Something failed");
    // console.error(error);
  } finally {
    session.endSession();
    res.send(rental);
  }
  // new Fawn.Task()
  //   .save("rentals", rental)
  //   .update(
  //     "movies",
  //     { _id: movie._id },
  //     {
  //       $inc: { numberInStock: -1 },
  //     }
  //   )
  //   .run();

  // Fawn is not working woth new version of mongoose so we want to use mongoose-transaction
  // this is same like fawn

  // old method sometime we miss the one function so we want to do this in transaction
  // rental = await rental.save();
  // movie.numberInStock--;
  // movie.save();
});

module.exports = router;
