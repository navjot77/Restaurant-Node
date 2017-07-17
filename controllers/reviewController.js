const mongoose=require('mongoose');
const Store=mongoose.model('Store')
const User=mongoose.model('User');
const Review=mongoose.model('Review');
exports.saveReview=async (req,res)=>{
    req.body.store=req.params.id;
    req.body.author=req.user._id;
    const review=await new Review(req.body);
    review.save();
    req.flash('success','Review Added Successfully');
    res.redirect('back');
}

