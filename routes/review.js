const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressErrors.js");
const {isLoggedIn,isReviewOwner}=require("../middkeware.js")
const reviewController=require("../controllers/reviews.js")

//+++__+++ validating server-side schema Review___+++
const validateReview=((req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);    
    }else {
        next();
    }

});
   //reviews post
   router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete review
router.delete("/:reviewId",isReviewOwner,wrapAsync(reviewController.deleteReview));
module.exports=router;