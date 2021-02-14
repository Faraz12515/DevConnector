const express = require("express");
const router = express.Router();
const User = require("./../../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  //Check Simple Validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please Enter All the fields" });
  }

  //Check For Existing User
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User Already Exist" });

    const newUser = new User({
      name,
      email,
      password,
    });

    //Create Salt and Hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            "mysecrettoken",
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                message: "User Registered Successfully",
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  password: user.password,
                },
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;

// Brad Traversy Code //

// const express = require("express");
// const router = express.Router();
// const gravatar = require("gravatar");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const config = require("config");
// const { check, validationResult } = require("express-validator");

// const Users = require("../../models/Users");

// // @route   POST api/users
// // @decs    Register user
// // @access  Public

// router.post(
//   "/",
//   [
//     check("name", "Name is required").not().isEmpty(),
//     check("email", "Please include a valid email").isEmail(),
//     check(
//       "password",
//       "Please enter a password with 6 or more characters"
//     ).isLength({ min: 6 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password } = req.body;
//     try {
//       // See if the user exists
//       let user = await User.findOne({ email });

//       if (user) {
//         res.status(400).json({ errors: [{ msg: "User already exists" }] });
//       }

//       // Get users gravatar

//       const avatar = gravatar.url(email, {
//         s: "200", //string
//         r: "pg", //rating
//         d: "mm", //default
//       });

//       user = new User({ name, email, avatar, password });

//       // Encrypt password

//       const salt = await bcrypt.genSalt(10);

//       user.password = await bcrypt.hash(password, salt);

//       await user.save();

//       // Return jasonwebtoken
//       const payload = {
//         user: {
//           id: user.id,
//         },
//       };

//       jwt.sign(
//         payload,
//         config.get(jwtSecret),
//         { expiresIn: 360000 },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );

//       res.json({ token });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server error");
//     }
//   }
// );

// module.exports = router;
