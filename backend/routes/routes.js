const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
let users = [];
router.post("/api/signup", (req, res, err) => {
  console.log(req.body);
  bcrypt.hash(req.body?.password, 10).then((hash) => {
    const user = new User({
      email: req.body?.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          success: true,
          message: "User created successfully!",
        });
      })
      .catch((error) => {
        res.status(200).json({
          success: false,
          message: "User creation failed!",
        });
      });
  });
});
router.put("/api/login", (req, res, err) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "No user found!",
        });
      } else {
        const clientPassword = req.body.password;
        return bcrypt.compare(clientPassword, user.password).then((isMatch) => {
          if (isMatch) {
            res.status(200).json({
              success: true,
              message: "User Logged in successfully!",
            });
          } else {
            res.status(400).json({
              success: false,
              message: "Incorrect password",
            });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "An error occurred during login",
      });
    });
  // res.status(200).send({
  //   success: true,
  //   users,
  // });
});

module.exports = router;
