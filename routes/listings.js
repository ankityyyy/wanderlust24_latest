const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/Expresserror.js");
const Listing = require("../models/listings.js");
const {listingSchema}= require("../schema.js");

//const listing = require("../routes/user.js");
//const { isLoggedIn } = require("../middleware.js");
//const listingController=require("../controller/listings.js")





const validateListings=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };
  
  
 //index
router.get("/",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({})
    res.render("index.ejs",{allListings});
}))
//new
router.get("/new",(req,res)=>{
    res.render("new.ejs");
})


//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","listing your request for does not exits");
      res.redirect("/listings")
    }

    res.render("show.ejs",{listing})
       }));

  //create route
  router.post("/",validateListings,wrapAsync(async(req,res)=>{
    let newListings=new Listing(req.body.listing)
      console.log(newListings);
    await newListings.save();
    req.flash("success", "New listing created successfully");
   res.redirect("/listings")
   
 }))


  //edit rout
router.get("/:id/edit", wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id);
  if(!listing){
    req.flash("error","listing your request for does not exits");
    res.redirect("/listings")
  }
res.render("edit.ejs",{listing})
}));

//update
router.put("/:id",validateListings,wrapAsync(async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  req.flash("success","listing update");
  console.log("i am update")
  res.redirect(`/listings/${id}`)

}))

//delete
router.delete("/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
 d= await Listing.findByIdAndDelete(id)
 req.flash("error","Delete listings");
 console.log(d)
  res.redirect("/listings");

}))

  
  
  module.exports=router;
  
