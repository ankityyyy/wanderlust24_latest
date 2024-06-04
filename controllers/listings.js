const Listing = require("../models/listings.js");
//index
module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({})
    res.render("index.ejs",{allListings});
}

//new
module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};


 //show route   
module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","listing your request for does not exits");
      res.redirect("/listings")
    }

    res.render("show.ejs",{listing})
       }

//create route
  module.exports.createListings =async(req,res)=>{
    let newListings=new Listing(req.body.listing)
    newListings.owner=req.user._id;
      console.log(newListings);
    await newListings.save();
    req.flash("success", "New listing created successfully");
   res.redirect("/listings")
   
 }

//edit rout
  module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
      req.flash("error","listing your request for does not exits");
      res.redirect("/listings")
    }
  res.render("edit.ejs",{listing})
  }


//update
module.exports.updatelistings=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success","listing update");
    console.log("i am update")
    res.redirect(`/listings/${id}`)
  
  }

//delete
module.exports.deleteListings=async(req,res)=>{
    let {id}=req.params;
   d= await Listing.findByIdAndDelete(id)
   req.flash("error","Delete listings");
   console.log(d)
    res.redirect("/listings");
  
  }


