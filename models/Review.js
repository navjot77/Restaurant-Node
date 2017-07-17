const mongoose=require('mongoose');
mongoose.Promise=global.Promise;


const ReviewSchema=new mongoose.Schema({

    author:{type:mongoose.Schema.ObjectId, ref:'User', required:'Author of Review is required'},
    created:{type:Date, default:Date.now()},
    rating:{type:Number,min:1, max:5},
    store:{type:mongoose.Schema.ObjectId, ref:'Store', required:'Enter Store for review.'},
    comment:{type:String, required:'Review must have description'}


});

module.exports= mongoose.model('Review',ReviewSchema);