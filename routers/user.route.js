const express = require('express');
const { User } = require('../models/user.model.js')
const router = express.Router();

router
.route("/")
.get((req, res) => {
    res.send("USER LOGGED IN")
})