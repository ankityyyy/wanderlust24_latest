const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });
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
console.log(listing)
    res.render("show.ejs",{listing})
       }

//create route
  module.exports.createListings =async(req,res,next)=>{ 

    let response=await geocodingClient
    .forwardGeocode({
      query:req.body.listing.location,
      limit:1,
    })
    .send();



let url=req.file.path;
let filename=req.file.filename

    let newListings=new Listing(req.body.listing)
    newListings.owner=req.user._id;
    newListings.image={url,filename};
    newListings.geometry=response.body.features[0].geometry;
     // console.log(newListings);//first time edit karna par image show nai ho raha h 
    let saveListing = await newListings.save();
    console.log(saveListing);
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
 let originalImageUrl=listing.image.url;
 originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_150");
res.render("edit.ejs",{listing,originalImageUrl})
  }



 
//update
module.exports.updatelistings=async(req,res)=>{
    let {id}=req.params;
    const l = await Listing.findById(id)
    const geometry = l.geometry
    

    console.log(geometry)
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })  
    listing.geometry = geometry
    let response=await geocodingClient
    .forwardGeocode({
      query:req.body.listing.location,
      limit:1,
    })

    .send();
  
    listing.geometry=response.body.features[0].geometry;
    console.log(listing,response.body.features[0].geometry,"geo")
    if(typeof req.file !== "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      console.log(listing,"list")
      await listing.save();
 }
 await listing.save();
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


