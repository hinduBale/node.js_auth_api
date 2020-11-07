const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {registerValidation, loginValidation} = require('../validation.js'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
   
    //Let's validate the info before creating a user:
    const { error } = registerValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    //Checking if user is already in userbase
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) {
        return res.status(400).send("Email already exists");
    }

    //Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Creating a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    //Saving the new user
    try {
        const savedUser = await user.save();
        res.send(user._id);
    } catch(err) {
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    //Let's validate the info before logging in an user:
    const { error } = loginValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    //Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send("Email not found");
    }
    //Is the password correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass)
        return res.status(400).send('Invalid Password')
    
    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;