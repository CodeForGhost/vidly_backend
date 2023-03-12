const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isGold: { type: Boolean, default: false },
  })
);

function validateCustomer(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(5).required(),
    isGold: Joi.bool(),
  });
  return schema.validate(genre);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
