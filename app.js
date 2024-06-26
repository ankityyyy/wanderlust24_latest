if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}



const express=require("express");
const app=express();
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");
const path=require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}= require("./schema.js");
const Review=require("./models/reviews.js");
const listingRouter=require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require('passport')
const  LocalStrategy=require('passport-local');
const User=require("./models/users.js");
const userRouter = require("./routes/users.js");
 
const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl); 
 //await mongoose.connect('mongodb://127.0.0.1:27017/wanderfirst'); 
};



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error", ()=>{
  console.log("ERRORE in MONGO SESSION STORE",err)
});

app.use(session({store,
  secret:process.env.SECRET,
              resave:"false",
              saveUninitialized :"true",
              Cookie:{
                expires:Date.now()+7*24*60*60*1000,
                maxAge:7*24*60*60*1000,
                httpOnly:true,
              }
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.message=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.CurrUser=req.user;
  next()
})

// app.get("/demouser",async(req,res)=>{
//   let fakeData=new User({
//     email:"ankit@123789",
//     phone:620582488998,
//     username:"ankit",
//   })
//   let resa=await User.register(fakeData,"ankit")
//   res.send(resa);
// })

app.get("/", (req, res) => {
  res.redirect("/listings");
})



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)






app.use("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
  })
  

app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrongs"}=err;
  console.log(err);
  res.status(statusCode).render("error.ejs",{err});
//res.status(statusCode).send(message);
})


app.listen(8080,()=>{
    console.log("listen on port number:8080")
}
)


