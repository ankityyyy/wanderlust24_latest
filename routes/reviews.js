const express=require("express");
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/Expresserror.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");
const {reviewSchema}= require("../schema.js");
//const listingController=require("../controller/review.js")






const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};


//reviews
router.post("/",validateReview,
async(req,res)=>{
  let listing =await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review)
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","new reviews created!");
  res.redirect(`/listings/${listing._id}`)
})


  //delete reviews
  router.delete("/:reviewId",validateReview,
  wrapAsync(async(req,res)=>{
  
    let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull is used to remove items
        await Review.findByIdAndDelete(reviewId);
        console.log("revied deleted");
        req.flash("error","Delete reviews ");
        res.redirect(`/listing/${id}`); 
  }))

module.exports=router;