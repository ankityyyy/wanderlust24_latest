const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/Expresserror.js");
//const Listing = require("../models/listings.js");
const { isLoggedIn,isOwner ,validateListings} = require("../middleware.js");
const listingController=require("../controllers/listings.js")


//index //create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListings,wrapAsync(listingController.createListings));
  

//show route //update //delete
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,validateListings,wrapAsync(listingController.updatelistings))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListings))

//new
router.get("/new",isLoggedIn,listingController.renderNewForm);

 //edit rout
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports=router;
  
