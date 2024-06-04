const express=require("express");
const router=express.Router();
const user=require('../models/users.js')
const wrapAsync=require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/users.js");


//signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

//login
router.route("/login")
.get(userController.RenderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}) ,
userController.login);

//logout
router.get("/logout",userController.logout)


module.exports=router;