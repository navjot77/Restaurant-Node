const mongoose=require('mongoose');
const User=mongoose.model('User');
const promsify=require('es6-promisify');
const passport=require('passport');


exports.loginForm= (req,res)=>{
    res.render('loginpage',{title:'Login Page'})

};

exports.registerForm=(req,res)=>{
    res.render('register',{title:'Register User'})
};


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

        res.render('register',{title:'Register User', data:req.body})
        return;
    }
    else {
        next();
    }
};

exports.saveUserData= async (req,res,next)=>{
    const newUser=new User({user_email:req.body.user_email, name:req.body.name})
    const register=promsify(User.register,User);
    await register(newUser,req.body.password)
    next();

};
exports.userLogin=passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:'Invalid User Email or Password.',
    successFlash:'Successfully logged In'
});

exports.logout=(req,res)=>{
  req.logout();
  res.redirect('/');
};
exports.isLoggedIn=(req,res,next)=>{
  if (req.user){
      next();
      return;
  }
  req.flash('error','User Must be Logged In');
  res.redirect('/')

};
