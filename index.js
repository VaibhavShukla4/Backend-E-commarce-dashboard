const express = require("express");
//cors is a npm  middleware for cors error
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Products = require("./db/Products");
const app = express();
// app.use is middleware
const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";
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
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    console.log(token);
    if (err) {
      res.send({
        result: "something went wrong , Please try after sometime",
      });
    }
    res.send({ result, auth: token });
  });
});
// for login
app.post("/login", async (req, res) => {
  // console.log(req.body.email);
  let user = await User.findOne(req.body).select("-password");
  if (req.body.email && req.body.password) {
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        console.log(token);
        if (err) {
          res.send({
            result: "something went wrong , Please try after sometime",
          });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send("No User Found");
    }
  } else {
    res.send("both field are mandatory");
  }
});
//for add products
app.post("/add-products", async (req, res) => {
  let product = new Products(req.body);
  let result = await product.save();
  res.send(result);
  console.log(result);
});
//for fetching list
app.get("/list-products", async (req, res) => {
  let product = await Products.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "no product found !" });
  }
});
// for delete  a specific product
app.delete("/product/:id", async (req, res) => {
  let result = await Products.deleteOne({ _id: req.params.id });
  res.send(result);
  console.log(result);
});
//  for fetch one product  with the help of params
app.get("/product/:id", async (req, res) => {
  let result = await Products.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No record Found" });
  }
  // console.log(result);
});

// for update the product data
app.put("/product/:id", async (req, res) => {
  let result = await Products.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No record Found" });
  }
  // console.log(result);
});
app.get("/search/:key", async (req, res) => {
  let result = await Products.find({
    $or: [
      { name: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { compony: { $regex: req.params.key } },
    ],
  });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No record Found" });
  }
});
app.listen(5000);
