const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Users = require("../../models/Users");

// @route   GET api/auth
// @decs    Test route
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-passowrd");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
