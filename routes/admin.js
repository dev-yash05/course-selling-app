const{ Router } = require('express');
const adminRouter = Router();
const {adminModel} = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_ADMIN_PASSWORD = "this is the secret"



adminRouter.post('/signup', async (req,res) =>{
    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hashSync(password, 10);

    await adminModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    });

    res.json({
        message: "Signed Up Successfully as an Admin!",
        data: {
            email: email,
            firstName: firstName,
            lastName: lastName
        }
    });
}); 

adminRouter.post('/signin', async (req,res) =>{
const{ email, password } = req.body;

    const response = await adminModel.findOne({
        email: email
    });

    if(!response){
        res.status(403).json({
            message: "Incorrect creds"
        });
        return;
    }

    const passwordMatch = await bcrypt.compareSync(password, response.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_ADMIN_PASSWORD);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }

});
adminRouter.post('/course', (req,res) =>{
    res.json({
        message: 'signup endpoint'
    });
});
adminRouter.put('/course', (req,res) =>{
    res.json({
        message: 'signup endpoint'
    });
});
adminRouter.get('/course/bulk', (req,res) =>{
    res.json({
        message: 'signup endpoint'
    });
});


module.exports = {
    adminRouter: adminRouter
}
