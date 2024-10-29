const express=require("express");
const User=require("../models/user");
module.exports.signupRoute=async(req,res)=>{
    try{
    let {username,password,email}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to wonderlust");
        res.redirect('/listings'); 
    });
   
} catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}
module.exports.loginRoute=async(req,res)=>{
    req.flash("success","welcome to wannderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
   
   }

module.exports.logoutRoute=(req,res)=>{
    req.logout((err)=>{
      if(err){
      return next(err);
  } 
  req.flash("success","you are logged out");
  res.redirect("/listings");
   });
  }
