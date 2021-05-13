const { Router } = require("express");
const { User } = require("../models/user.model.js");
const { Cart } = require("../models/cart.model.js");
const { Product } = require("../models/products.model.js");
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
    res.json({ success: true, userResponse });
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
          path: "product" 
        } 
      });
    console.log(req.body);
    const userResponse = {
      userId: user._id,
      username: user.username,
      cart: user.cart,
      wishlist: user.wishlist,
    };
    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong id or password" });
    }
    res.json({ success: true, userResponse });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "No user exists with the given credentials",
    });
  }
});

router.route("/cart").post(async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart } = await User.findById(userId).populate({
      path: "cart",
      populate: {
        path: "product",
      },
    });
    console.log(cart);
    if (!cart) {
      res.status(404).json({ success: false, message: "your cart is empty" });
    }
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, errMessage: err });
  }
});
// .post(async (req, res) => {
//   try{
//     const {userId, productId, quantity} = req.body;
//     const user = await User.findById(userId)
//     console.log(productId)
//     const newCartItem = new Cart ({product:productId, quantity})
//     console.log(newCartItem)
//     await newCartItem.save()
//     user.cart.push(newCartItem._id)
//     await user.save();
//     res.json({success: true, cart: user.cart})
//   } catch(err){
//     console.error(err)
//     res.status(500).json({ success: false, errMessage: err})
//   }
// })

router
  .route("/wishlist")
  .get(async (req, res) => {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username }).populate("wishlist");
      if (!user.wishlist) {
        res
          .status(404)
          .json({ success: false, message: "your wishlist is empty" });
      }
      res.json({ success: true, wishlist: user.wishlist });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, errMessage: err });
    }
  })
  .post(async (req, res) => {
    try {
      const { username, productId } = req.body;
      const user = await User.findOne({ username });
      if (!Product.findById(productId)) {
        user.wishlist.push(productId);
        user.save();
        return res.json({ success: true, wishlist: user.wishlist });
      }
      res
        .status(409)
        .json({ success: false, message: "product already exists" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, errMessage: err });
    }
  });

module.exports = router;
