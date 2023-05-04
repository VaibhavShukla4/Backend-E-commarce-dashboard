const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  userId: String,
  compony: String,
});
module.exports = mongoose.model("products", productSchema);
