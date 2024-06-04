const user=require('../models/users.js');


module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,password,email,phone}=req.body;
        let NewUser=new user ({email,username,phone});
        const regi=await user.register(NewUser,password);
        console.log(regi);
        req.login(regi,(err)=>{
    if(err){
               return next(err)
            }
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  
}


module.exports.RenderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wanderlust");
    let redirectUrl=  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl );
  //  res.redirect("/listings")
}


module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings");
    })

}