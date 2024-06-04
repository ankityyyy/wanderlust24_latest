const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");


module.exports.reviewCreated=async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    console.log(req.body);
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new reviews created!");
    res.redirect(`/listings/${listing._id}`)
  }


  module.exports.reviewDelete=async(req,res)=>{
  
    let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull is used to remove items
        await Review.findByIdAndDelete(reviewId);
        console.log("revied deleted");
        req.flash("error","Delete reviews ");
        res.redirect(`/listing/${id}`); 
  }