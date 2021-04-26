const {Schema, model} = require('mongoose')

const ProductSchema = new Schema({
    name: String,
    price: Number
})

const Product = model("Product", ProductSchema)

module.exports = { Product }