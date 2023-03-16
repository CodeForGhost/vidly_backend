const express = require("express");
const { Customer, validate } = require("../models/customer");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  // customer = await customer.save();
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("The Customer Not Found");
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { phone: req.body.phone },
    { isGold: req.body.isGold },
    { new: true }
  );
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!customer) return res.status(404).send("The Customer Not Found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!customer) return res.status(404).send("The Customer Not Found");

  res.send(customer);
});

module.exports = router;
