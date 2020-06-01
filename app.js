var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed"),
	passport    = require("passport"),
	LocalStrategy=require("passport-local"),
	User 		 = require("./models/user"),
    methodOverride=require("method-override"),
	flash        = require("connect-flash");
var commentRoutes     = require("./routes/comment"),
	campgroundRoutes  = require("./routes/campground"),
	indexRoutes 	  = require("./routes/index");
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(methodOverride("_method"));
app.set("view engine" ,"ejs");
app.use(flash());
//seedDB();
app.use(express.static(__dirname+"/public"))

var bodyParser  = require("body-parser");
app.use(require("express-session")({
	secret : "I will not get disheartened by failures",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error   = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.listen(3000,function(){
	console.log("Server is Listening");
});
