const { Router } = require("express");
const { User } = require("../models/user.model.js");
const { Cart } = require("../models/cart.model.js");
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { userid } = req.headers;
      const { cart } = await User.findById(userid).populate({
        path: "cart",
        populate: {
          path: "product",
        },
      });
      if (!cart) {
        res.status(404).json({ success: false, message: "your cart is empty" });
      }
      res.json({ success: true, cart });
    } catch (err) {
      res.status(500).json({ success: false, errMessage: err });
    }
  })
  .post(async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      const user = await User.findById(userId);
      console.log(productId);
      const newCartItem = new Cart({ product: productId, quantity });
      console.log(newCartItem);
      await newCartItem.save();
      user.cart.push(newCartItem._id);
      await user.save();
      const updatedUser = await User.findById(userId)
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
      res.json({ success: true, cart: updatedUser.cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, errMessage: err });
    }
  });

module.exports = router;
