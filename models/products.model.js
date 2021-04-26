const {Schema, Model} = require('mongoose')

const ProductSchema = new Schema({
    name: String,
    price: Number
})

const Product = Model("Product", ProductSchema)

module.exports = { Product }