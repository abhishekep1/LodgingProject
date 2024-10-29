const Listing=require("./models/listing");
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must logged in to crate a listing");
    return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner= async (req,res,next)=>{
    let { id }=req.params;
    let listing=await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","you don't have permission to edit");
      return res.redirect( `/listings/${id}`);

    }
    next();

};


module.exports.isReviewOwner= async (req,res,next)=>{
    let {id, reviewId }=req.params;
    let review=await Review.findById(reviewId);
    console.log(res.locals.currentUser);
    if( !review.author.equals(res.locals.currentUser._id))
        {
        req.flash("error","Only the Author can delte this Review");
      return res.redirect( `/listings/${id}`);

    }
    next();

}

