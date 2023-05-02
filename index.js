const express = require("express");
//cors is a npm  middleware for cors error
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
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
app.listen(5000);
