const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

// const { remove } = require('../models/user');


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));


router.route('/login')    
    //this serves the form
    .get(users.renderLogin)
    //this actually logs you in.
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;