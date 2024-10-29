if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express=require("express");
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const path=require("path");
const ExpressError=require("./utils/ExpressErrors.js");
const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const app=express();
const methodOverride=require("method-override");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;
console.log("+++++++++++++",dbUrl)

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true})); 
app.set("view enging","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const sessionOption={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:+7*24*60*60*1000,
        httpOnly:true,
    },
};
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
        
    },
    touchAfter:24*3600,

});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});


main().then(()=>{
    console.log("connected");
})
.catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wandelust');
await mongoose.connect(dbUrl);
}

  


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demo",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student1@gmail.com",
//         username:"somanna",
//     });
//     let registerdUser=await User.register(fakeUser,"helloboss");
//     res.send(registerdUser);
// });
   

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page Not Found!!"));
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("errors.ejs",{message})
});

app.listen(8080,()=>{
    console.log("listening at port 8080");
});