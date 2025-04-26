const express = require('express');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose'); 
app.use(express.json());




app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/course', courseRouter);



async function main(){
    await mongoose.connect("mongodb+srv://yash:VvjbsPkwDBg1L4M0@cluster0.n7guk1x.mongodb.net/course-selling-app?retryWrites=true&w=majority");
    app.listen(3000);
    console.log('listening on port 3000');
}

main();