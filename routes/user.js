const{ Router } = require('express');;
const { userModel } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRouter = Router();


userRouter.post('/signup', (req,res) =>{
    res.json({
        message: 'signup endpoint'
    });
});
userRouter.post('/signin', (req,res) =>{
    res.json({
        message: 'signup endpoint'
    });
});
userRouter.get('/purchases', (req,res) =>{
    res.json({
        message: 'signup endpoint'
    });
});


module.exports = {
    userRouter: userRouter
}
