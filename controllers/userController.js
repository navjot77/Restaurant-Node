const mongoose=require('mongoose');
//const User=mongoose.model('User');


exports.loginForm= (req,res)=>{
    res.render('loginpage',{title:'Login Page'})

};

exports.registerForm=(req,res)=>{
    res.render('register',{title:'Register User'})
};

exports.loginFormPost=  (req,res)=>{
    res.json(req.body.email);
}

exports.checkRegisterForm=(req,res,next)=>{

    req.sanitizeBody('name');
    req.checkBody('name','Please Enter Name.').notEmpty();
    req.checkBody('user_email','Please Enter Email.').isEmail();
    req.checkBody('password','Please Enter Password.').notEmpty();
    req.checkBody('confirm_password','Please confirm password.').notEmpty();

    req.checkBody('confirm_password',"Password do not match").equals(req.body.password);

    req.sanitizeBody('email').normalizeEmail({
            remove_dots:false,
            gmail_remove_subaddress:false,
            remove_extension:false

    });

    const errors=req.validationErrors();
    if (errors){
        req.flash('error',errors.map(err=>err.msg));

        res.render('register',{title:'Register User', body:req.body, flashes:req.flash()})
    }
    else {
        next();
    }


};

