const express=require("express");
const router=express.Router();
const user=require('../models/users.js')
const wrapAsync=require("../utils/wrapasync.js");
const passport = require("passport");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})




router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,password,email,phone}=req.body;
        let NewUser=new user ({email,username,phone});
        const regi=await user.register(NewUser,password);
        console.log(regi);
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  
}))


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}) ,
async(req,res)=>{
    req.flash("success","welcome to wanderlust");
    let redirectUrl=  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl );
})



module.exports=router;