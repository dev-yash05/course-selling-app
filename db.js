const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

mongoose.connect("mongodb+srv://yash:VvjbsPkwDBg1L4M0@cluster0.n7guk1x.mongodb.net/course-selling-app?retryWrites=true&w=majority")

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password:String,
    firstName: String,
    lastName: String
});
const adminSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password:String,
    firstName: String,
    lastName: String
});
const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});
const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
});



const userModel = mongoose.model('user', userSchema);
const adminModel = mongoose.model('admin', adminSchema);
const courseModel = mongoose.model('course', courseSchema);
const purchaseModel = mongoose.model('purchase', purchaseSchema);


module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}