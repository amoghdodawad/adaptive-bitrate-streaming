const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

function generateAccessToken(payload, secretKey, expiryTime){
    return jwt.sign({...payload}, secretKey, {
        expiresIn : expiryTime
    });
}

async function verifyToken(token, secretKey){
    return new Promise(function (resolve, reject){
        jwt.verify(token, secretKey, function(err, decoded){
            if(err) {
                reject('Token not valid');
            }
            resolve(decoded);
        })
    })
}


async function signUp(req,res){
    try {
        let { name, email, password, bio } = req.body;
        email = email.toLowerCase().split(' ')[0];
        const hash = await bcrypt.hash(password, 4);
        if(hash){
            try {
                const user = new User({ name, email, password: hash, bio });
                await user.save();
                const token = generateAccessToken( { name : user.name, email : email }, 
                    process.env.JWT_SECRET, 
                    process.env.EXPIRES_IN
                );
                res.status(200).json({ message : 'OK', name, email, token });
                
            } catch (err){
                if(err.code === 11000){
                    return res.status(400).json({ message : 'User with this email already exists!'});
                } else {
                    return res.status(500).json({ message : 'User could not be signed up!' });
                }
            }
        }
    } catch(err){
        return res.status(500).json({ message : 'An error occured while generating the password hash' });
    }
}

async function logIn(req,res){
    
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        const user = await User.findOne({ email },{ _id : 0 });
        bcrypt.compare(password, user.password, function(err, hash){
            if(err){
                return res.status(500).json({ message : 'Could not authenticate' });
            }
            if(hash){
                const token = generateAccessToken( { name : user.name, email : email }, 
                    process.env.JWT_SECRET, 
                    process.env.EXPIRES_IN
                );
                res.status(200).json({ message : 'OK', name : user.name, email, token });
            } else {
                res.status(400).json({ message : 'Enter the correct password' })
            }
        })
    } catch (error){
        res.status(400).json({ message : 'User does not exist! Try signing up.' })
    }
}

async function verifyLoggedIn(req, res){
    try {
        const { token } = req.body;
        const payload = await verifyToken(token, process.env.JWT_SECRET);
        const newToken = generateAccessToken({
            name : payload.name,
            email : payload.email
        },process.env.JWT_SECRET, process.env.EXPIRES_IN)
        res.status(200).json({ message : 'OK Authenticated', token : newToken });
    } catch (error) {
        res.status(401).json({ message : 'Not authenticated' });
    }
}

module.exports = {
    signUp,
    logIn,
    verifyLoggedIn
}