const{ Router } = require('express');
const { ObjectId } = require('mongoose');
const adminRouter = Router();
const {adminModel, courseModel} = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_ADMIN_PASSWORD } = require('../config');
const { adminMiddleware } = require('../middleware/admin');


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
adminRouter.post('/course', adminMiddleware ,async (req,res) =>{
    const adminId = req.userId;
    const{ title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })
    res.json({
        message: 'Course Created Successfully!',
        courseId: course._id.toString()
    });
});
adminRouter.put('/course', adminMiddleware, async (req, res) => {
    const adminId = req.userId; // Logged-in admin's ID
    const { courseId, title, description, imageUrl, price } = req.body;

    try {
        // Find the course to ensure it belongs to the logged-in admin
        const course = await courseModel.findOne({ _id: courseId });

        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        // Check if the logged-in admin is the creator of the course
        if (course.creatorId.toString() !== adminId) {
            return res.status(403).json({
                message: 'You are not authorized to update this course'
            });
        }

        // Update the course
        const result = await courseModel.updateOne(
            { _id: courseId },
            {
                $set: {
                    title: title,
                    description: description,
                    imageUrl: imageUrl,
                    price: price
                }
            }
        );

        res.json({
            message: 'Course Updated Successfully!',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating course',
            error: err
        });
    }
});
adminRouter.get('/course/bulk', async (req,res) =>{
    const adminId = req.query.adminId;

    if (!adminId) {
        return res.status(400).json({
            message: 'Admin ID is required'
        });
    }

    try {
        const courses = await courseModel.find({ creatorId: adminId });

        res.json({
            message: 'Courses fetched successfully!',
            data: courses
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching courses',
            error: err
        });
    }
});


module.exports = {
    adminRouter: adminRouter
}
