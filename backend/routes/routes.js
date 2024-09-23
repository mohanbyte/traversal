const express = require("express");
const router = express.Router();
let users = [];
router.post("/signup", (req, res, err) => {
  console.log(req.body);
  if (req.body["user"] && req.body["password"]) {
    users.push({ user: req.body.user, password: req.body.password });
    res.status(200).send({
      success: true,
    });
  } else
    res.status(200).send({
      success: false,
    });
});

router.get("/users", (req, res, err) => {
  res.status(200).send({
    success: true,
    users,
  });
});

module.exports = router;
