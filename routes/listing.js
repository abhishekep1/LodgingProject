const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressErrors.js");
const {listingSchema}=require("../schema.js");
const listingController=require("../controllers/listings.js");
const {isLoggedIn,isOwner}=require("../middkeware.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage })
//+++__+++ validating server-side schema Listings___+++
const validateListing=((req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);    
    }else {
        next();
    }

});
//search route
router.get("/search",listingController.searchFunction);
//filter 
router.get("/filters",listingController.filterListings);
//Index route && Create Route
router
.route("/").get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)); 

//new
 router.get("/new",isLoggedIn, listingController.rendernewform);

    //show route &&Delete Route && Update Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListings))
    



 //edit
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));
 
   module.exports=router; 