const Listing = require("./models/listings.js");
const ExpressError=require("./utils/Expresserror.js");
const {listingSchema,reviewSchema}= require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
 
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be looged in");
        return res.redirect("/login");
    }
    next()
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}



module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.CurrUser._id)){
        req.flash("error","you are not the owner of the listings");
        res.redirect(`/listings/${id}`)
    } else {
    next();
    }
}


module.exports.validateListings=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };


  
  module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };
  

