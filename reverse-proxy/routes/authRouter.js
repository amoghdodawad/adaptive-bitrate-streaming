const { logIn, signUp, verifyLoggedIn } = require('../controllers/authController');

const router = require('express').Router();
const express = require('express');
router.use(express.json());
router.post('/login',logIn);
router.post('/signup',signUp);
router.post('/verifyloggedin',verifyLoggedIn);
module.exports = router;