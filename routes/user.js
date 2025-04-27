const{ Router } = require('express');;
const { userModel } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const{ JWT_USER_PASSWORD } = require('../config');
const userRouter = Router();


userRouter.post('/signup', async (req,res) =>{
    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hashSync(password, 10);

    await userModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    });

    res.json({
        message: "Signed Up Successfully as an User!",
        data: {
            email: email,
            firstName: firstName,
            lastName: lastName
        }
    });
});
userRouter.post('/signin', async (req,res) =>{
    const{ email, password } = req.body;

    const response = await userModel.findOne({
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
        }, JWT_USER_PASSWORD);

        res.json({
            message: "Signed in Sussessfully!",         
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
});
userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }//we can use purchases.map(p => p.courseId) as well
    })

    res.json({
        purchases,
        coursesData
    })
})


module.exports = {
    userRouter: userRouter
}
