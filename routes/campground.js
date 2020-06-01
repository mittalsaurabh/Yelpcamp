var express=  require("express")
var router  = express.Router();
var Campground = require("../models/campground");
var middelwareObj = require("../middelware");
router.get("/",function(req,res){
	Campground.find({},function(err,allcamps){
		if(err){
			console.log(err);
		}else{
			res.render("index",{data:allcamps});
		}
	});
});


router.post("/", middelwareObj.isLoggedIn,function(req,res){
	var a = req.body.name;
	var b = req.body.image;
	var d = req.body.description;
	var e = req.body.price;
	var author = {
		id: req.user._id,
		username : req.user.username
	};
	var c = {name : a, image:b , description:d,author :author,price:e};
	
	Campground.create(c ,function(err,newcampground)
	{
		if(err)
			{
				console.log(err);
			}
		else{
			req.flash("success","Added a Campground Succesfully")
			res.redirect("/campgrounds");
		}
	}
);	
});

router.get("/new" ,  middelwareObj.isLoggedIn,function(req,res){
	 res.render("new");
});

router.get("/:id" , function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("show",{campground: foundCampground});
		}
	})
});
// Edit
router.get("/:id/edit",middelwareObj.checkCampGroundOwnership,function(req,res){
		Campground.findById(req.params.id,function(err,foundCampground){
					res.render("edit" , {campground:foundCampground});
		});
	});
// Update
router.put("/:id",middelwareObj.checkCampGroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Updated the Campground Succesfully!!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
//Destroy
router.delete("/:id",middelwareObj.checkCampGroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err)
	{
		req.flash("success","Deleted the Campground Succesfully!!");
		res.redirect("/campgrounds");							 
	});
});
module.exports = router;