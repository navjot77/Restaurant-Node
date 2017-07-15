const mongoose=require('mongoose');
const User=mongoose.model('User');
const promsify=require('es6-promisify');
const passport=require('passport');
const crypto=require('crypto');
const email=require('../handlers/email');


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
exports.editAccount= (req,res)=> {
    if (req.user){
        res.render('editAccount',{title:'Edit Account',user:req.user});
    }
    else{
        req.flash('error','Please LogIn.');
        res.redirect('/')
    }
    
}
exports.updateAccount=async (req,res)=>{
    if (req.user){
        const details= {
            user_email:req.body.user_email,
            name:req.body.name
        };

        const user=await User.findOneAndUpdate({_id:req.user._id},
            {$set: details},
            {new:true, runValidators:true,context:'query'});

        req.flash('success',"Successfully updated account details");

        res.render('editAccount',{title:'Edit Account',user:user, flashes:req.flash()});
    }
    else{
        req.flash('error','Please LogIn.');
        res.redirect('/')
    }

};
exports.updatePassword= async (req,res)=>{
    const user=await User.findOne({user_email:req.body.user_email})
    if(!user){
        req.flash("success",'Check your email for reset link')
        req.redirect('/login');
        return
    }
    user.passToken=crypto.randomBytes(15).toString('hex');
    user.tokenExpire=Date.now() + 3600000;
    await user.save();
// Sending EmAil.. USing email_helpers and views...
    const url=`${req.headers.host}/update/reset/${user.passToken}`


    await email.sendData({
        user,
        subject:'Password Reset!!',
        url,
        filename:'password-reset'
    });

    req.flash('success','Check your email for reset link');
    res.redirect('/login');


};

exports.passwordForm=async (req,res)=>{
  const token=req.params.token;
  const user= await User.findOne({
      passToken:token,
      tokenExpire:{$gt:Date.now()}
  });
  if(!user){
      req.flash('error',"Token Expired or Wrong token !!")
      res.redirect('/');
        return;
  }
  else{
      res.render('passwordResetForm',{title:'Reset Your Password'});
  }



};

exports.checkTokenAndResetPassword= async (req,res)=>{

    const token=req.params.token;
    const user= await User.findOne({
        passToken:token,
        tokenExpire:{$gt:Date.now()}
    });
    if(!user){
        req.flash('error',"Token Expired or Wrong token !!")
        res.redirect('/');
        return;
    }


    req.checkBody('password',"Input the password field").notEmpty();
    req.checkBody('confirm_password',"Input the password field").notEmpty();
    req.checkBody('confirm_password',"Password do not match").equals(req.body.password);

    const errors=req.validationErrors();
    if (errors){
        req.flash('error',errors.map(err=>err.msg));

        res.redirect('back');
        return;
    }
    const setPassword=promsify(user.setPassword,user)
    await setPassword(req.body.password);
    user.tokenExpire=undefined;
    user.passToken=undefined;
    const updatedUser=await user.save();
    req.flash('success', 'Password Updated. You are logged in');
    await req.login(updatedUser);
    res.redirect('/');




}