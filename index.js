const express = require("express");
//cors is a npm  middleware for cors error
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Products = require("./db/Products");
const app = express();
// app.use is middleware
app.use(express.json());
app.use(cors());

// for signup
app.post("/register", async (req, res) => {
  // console.log(req.body);
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  // console.log(result);
  delete result.password;
  res.send(result);
});
// for login
app.post("/login", async (req, res) => {
  // console.log(req.body.email);
  let user = await User.findOne(req.body).select("-password");
  if (req.body.email && req.body.password) {
    if (user) {
      res.send(user);
    } else {
      res.send("No User Found");
    }
  } else {
    res.send("both field are mandatory");
  }
});

app.post("/add-products", async (req, res) => {
  let product = new Products(req.body);
  let result = await product.save();
  res.send(result);
  console.log(result);
});
app.get("/list-products", async (req, res) => {
  let product = await Products.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "no product found !" });
  }
});
app.get("/list-products", async (req, res) => {
  let product = await Products.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "no product found !" });
  }
});
app.delete("/product/:id", async (req, res) => {
  let result = await Products.deleteOne({ _id: req.params.id });
  res.send(result);
  console.log(result);
});
app.get("/product/:id", async (req, res) => {
  let result = await Products.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No record Found" });
  }
  // console.log(result);
});
app.listen(5000);
