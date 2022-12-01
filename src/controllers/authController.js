const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

const authConfig = require('../config/auth');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try{
        if (await User.findOne({ email }))
                return res.status(400).send({ error: 'User already exists' });
        if (name.length < 1)
                return res.status(400).send({ error: 'Name cannot be empty' });
        if (password.length < 1)
                return res.status(400).send({ error: 'Password cannot be empty' });

                const user = await User.create(req.body);

                user.password = undefined;

                return res.send({
                    user, 
                    token: generateToken({ id: user.id })
                });
    }catch(error){
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email}).select('+password');;
    if(!user){
        return res.status(400).send({ error: 'User not found' });
    }

    user.password = undefined;

    const token = res.send({
        user,
        toke: generateToken({ id: user.id })
    });
});

module.exports = app => app.use('/auth', router);