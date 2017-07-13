const mongoose=require('mongoose');
mongoose.Promise= global.Promise;
const md5=require('md5');
const errorHandler=require('mongoose-mongodb-errors');
const validators=require('validator');
const passportLocal=require('passport-local-mongoose');


const userSchema= new mongoose.Schema({

    user_email:{
        type: String,
        trim:true,
        unique:true,
        lowercase:true,
        required: 'Please enter your Email Id.',
        validate: [validator.isEmail,'__INVALID EMAIL ___']
    },
    name:{
        type: password,
        trim:true,
        required: 'Enter your password.'
    },
    created:{
        type: Date,
        default: Date.now()

    }

});

userSchema.plugin(passportLocal,{usernameField:'user_email'});
userSchema.plugin(errorHandler);

module.exports= mongoose.model('User',userSchema);