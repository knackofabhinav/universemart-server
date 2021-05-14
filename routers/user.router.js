const { Router } = require("express");
const { User } = require("../models/user.model.js");
const router = Router();

router.route("/signup").post(async (req, res) => {
  try {
    const user = req.body;
    const NewUser = new User(user);
    const savedUser = await NewUser.save();

    const userResponse = {
      username: savedUser.username,
      cart: savedUser.cart,
      wishlist: savedUser.wishlist,
    };
    res.json({ success: true, user: userResponse });
  } catch (err) {
    res.status(500).json({ success: false, errMessage: err });
  }
});

router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
      .populate({
        path: "cart",
        populate: {
          path: "product",
        },
      })
      .populate({
        path: "wishlist",
        populate: {
          path: "product",
        },
      });
    const userResponse = {
      userId: user._id,
      username: user.username,
      cart: user.cart,
      wishlist: user.wishlist,
    };
    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong id or password" });
    }
    res.json({ success: true, user: userResponse });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "No user exists with the given credentials",
    });
  }
});

module.exports = router;
