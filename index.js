require('dotenv').config();
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
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log('listening on port 3000');
}

main();