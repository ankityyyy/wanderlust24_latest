const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
//const Listing = require("../models/listings.js");
const { isLoggedIn,isOwner ,validateListings} = require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})


//new
router.get("/new",isLoggedIn,listingController.renderNewForm);  

//index //create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListings,wrapAsync(listingController.createListings));
/*.post(upload.single('listing[image]'),(req,res)=>{
    
    console.log(req.file)
    res.send(req.file);
})*/


//show route //update //delete
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,upload.single('listing[image]'),validateListings,wrapAsync(listingController.updatelistings))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListings))



 //edit rout
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports=router;
  
