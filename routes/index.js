var express=  require("express")
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/" ,function(req,res){
	res.render("landing");
});


router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			req.flash("error","What the hell is going on!!");
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to the Yelpcamp");
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login" , function(req,res){
	res.render("login");
});
router.post("/login" ,passport.authenticate("local",{
	successRedirect :"/campgrounds",
	failureRedirect :"/login"
}),function(req,res){
	
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!!");
	res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;