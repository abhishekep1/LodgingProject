const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middkeware");
const userController=require("../controllers/users.js")
//signup route
router.route("/signup")
.get((req,res)=>{
    res.render("users/signup.ejs"); })
.post(wrapasync(userController.signupRoute));

//signup user information storing
router
//login
router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");   })
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.loginRoute);

//login user information validation
//logout
router.get("/logout",userController.logoutRoute);
module.exports=router;