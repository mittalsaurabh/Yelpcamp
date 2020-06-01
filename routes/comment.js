
var express=  require("express")
var router  = express.Router({mergeParams:true});
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middelwareObj = require("../middelware/index");
router.get("/new" , middelwareObj.isLoggedIn,function(req,res){
	
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("newC",{campground:campground});
		}
	});
});



router.post("/", middelwareObj.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   comment.save();
               campground.comments.push(comment);
               campground.save();
			   console.log(comment);
			   req.flash("success","Succesfully added a comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
 
});

router.get("/:comment_id/edit",middelwareObj.checkCommentOwnership,function(req,res){
	//req.params.id
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("editC",{campground_id:req.params.id,comment:foundComment});
		}
	})
});
router.put("/:comment_id",middelwareObj.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			console.log(updatedComment);
			req.flash("success","Comment Updated succesfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
router.delete("/:comment_id",middelwareObj.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Deleted Comment Succesfully!!")
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//middleware

// function checkCommentOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 	Comment.findById(req.params.comment_id,function(err,foundComment){
// 			if(err){
// 				res.redirect("back");
// 			}else{
// 				if(foundComment.author.id.equals(req.user._id)){
// 					next();
// 				}else{
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	}
// 	else{	
// 		res.redirect("/campgrounds/"+req.params.id);
// 	}
// }

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }


module.exports = router;