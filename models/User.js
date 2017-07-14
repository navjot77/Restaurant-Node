const mongoose=require('mongoose');
mongoose.Promise= global.Promise;
const md5=require('md5');
const errorHandler=require('mongoose-mongodb-errors');
const validator=require('validator');
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
        type: String,
        trim:true,
        required: 'Enter your Name.'
    },
    created:{
        type: Date,
        default: Date.now()
    }
});

userSchema.plugin(passportLocal,{usernameField:'user_email'});
userSchema.plugin(errorHandler);

userSchema.virtual('gravatar').get(function () {
    const hash_md5=md5(this.user_email);
    return `https://gravatar.com/avatar/${hash_md5}?s=250`
});


module.exports= mongoose.model('User',userSchema);