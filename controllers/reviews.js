const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const express=require("express");

module.exports.createReview=async(req,res)=>{
    // console.log("got it=========================================================================");
    let listing=await Listing.findById(req.params.id);
    console.log(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success","New Review created!")
    res.redirect(`/listings/${listing._id}`);
   }

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
   
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review deleted!")
    res.redirect(`/listings/${id}`);
 }