const {promisify} = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const AppError = require('./../utils/appError');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signUp = catchAsync(async function (req, res,next) {
    const newUser = await User.create({


        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser 
        }
    });  
    
});
exports.login = catchAsync(async function (req, res,next) {
    const {email, password} = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user=await User.findOne({email}).select('+password');
    

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3)if everything okay, send token to clint
    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    });
    
}); 

exports.protect = catchAsync(async function (req, res, next) {
    // 1) Getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));

    }
    // 2) Verification of token
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//    console.log(decoded);
    // 3) Check if user still exists
    const currenUser = await User.findById(decoded.id);
    if (!currenUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currenUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currenUser;

    next();
    
});
exports.restrictTo = function (...roles) {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};
exports.forgotPassword = catchAsync(async function (req, res, next) {
    // 1) Get user based on POSTed email
    const user = User.findOne({email: req.body.email});
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();

    // 3) Send it to user's email


});
exports.resetPassword = catchAsync(async function (req, res, next) {

});