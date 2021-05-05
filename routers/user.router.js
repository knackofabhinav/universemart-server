const {Router} = require("express");
const { User } = require("../models/user.model.js");
const { Cart } = require("../models/cart.model.js");
const { Product } = require("../models/products.model.js");
const router = Router();
const {extend} = require("lodash");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { username, password } = req.body;
      const [user] = await User.find({ username })
      console.log(user)
      if(user.password !== password){
        return  res.json({success: false, message: "Wrong id or password"})
      } res.json({success: true, message: user.username + " logged in" })
    } catch (err) {
      res
        .status(404)
        .json({
          success: false,
          message: "No user exists with the given credentials",
        });
    }
  })
  .post(async (req, res) => {
    try {
      const user = req.body;
      const NewUser = new User(user);
      const savedUser = await NewUser.save();
      res.json({ success: true, savedUser });
    } catch (err) {
      res.status(500).json({ success: false, errMessage: err });
    }
  });

  router
  .route("/cart")
  .get(async(req, res) => {
    try{
      const {username} = req.body;
      const {cart} = await User.findOne({ username })
      if (!cart){
        res.status(404).json({ success: false, message: "your cart is empty"})
      }
      res.json({ success: true, cart})
    } catch(err){
      res.status(500).json({ success: false, errMessage: err})
    }
  })
  .post(async (req, res) => {
    try{
      const {username, productId, quantity} = req.body;
      const user = await User.findOne({ username })
      const productWithQuantity = {productId, quantity}
      user.cart.push(productWithQuantity)
      user.save();
      res.json({success: true, cart: user.cart})
    } catch(err){
      console.error(err)
      res.status(500).json({ success: false, errMessage: err})
    }
  })


  router
  .route("/wishlist")
  .get(async (req, res) => {
    try{
      const {username} = req.body;
      const user = await User.findOne({ username }).populate("wishlist")
      if(!user.wishlist){
        res.status(404).json({ success: false, message: "your wishlist is empty"})
      } res.json({ success: true, wishlist:user.wishlist})
    } catch(err){
      console.error(err)
      res.status(500).json({ success: false, errMessage: err })
    }
  })
  .post(async (req, res) => {
    try{
      const {username, productId} = req.body
      const user = await User.findOne({ username })
      if(!Product.findById(productId)){
        user.wishlist.push(productId)
        user.save()
        return res.json({ success: true, wishlist:user.wishlist})
      } res.status(409).json({ success: false, message: "product already exists"})
    } catch(err){
      console.error(err)
      res.status(500).json({ success: false, errMessage: err })
    }
  })

module.exports = router;
