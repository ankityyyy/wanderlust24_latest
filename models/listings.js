
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("../models/reviews.js");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
 /* image: {
    fileName: String,
    url: {
      type: String,
      default:
        "data:image/jpeg;base64,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",
    },
  },*/
  image: {

url: String,
  filename: String,
  },

  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,ref:"Review"   
    }
  ],


owner:{
  type:Schema.Types.ObjectId,
  ref:"User",
},



geometry: {
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ['Point'], // 'location.type' must be 'Point'
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})






const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;





