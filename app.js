//==========================
//Imports
//==========================
//NPM
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

//Config
try {
	var config = require("./config");
} catch (e) {
	console.log("could not import config.");
	console.log(e)
};

//route
const gameRoutes = require('./routes/games');
const commentRoutes = require('./routes/comments');
const landingRoutes = require('./routes/main');
const authRoutes = require("./routes/auth");

//model
const Game = require("./models/game");
const Comment = require("./models/comment");
const User = require("./models/user");

//==========================
//Development
//==========================
// Morgan
app.use(morgan("tiny"));

//const seed = require("./utils/seed");
//seed();
//==========================
//Config
//==========================
//Connect to DB
try {
	mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} catch (e) {
	console.log("could not connect to config")
	mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
};


//Express config
app.set("view engine", "ejs");
app.use(express.static("public"));

//Express Session Config
app.use(expressSession({
	secret: process.env.ES_SECRET || config.expressSession.secret,
	resave: false,
	saveUninitialized: false
}));

//body parser
app.use(bodyParser.urlencoded({extended: true}));

//override
app.use(methodOverride("_method"));

//flash
app.use(flash());

//Passport Config
app.use(passport.initialize());
app.use(passport.session()); //persistent sessiions
passport.serializeUser(User.serializeUser()); //what data should be stored
passport.deserializeUser(User.deserializeUser()); // get user data from session
passport.use(new localStrategy(User.authenticate())); //use local strategy

//state config
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.errorMessage = req.flash("error");
	res.locals.successMessage = req.flash("success");
	next();
});

//route config
app.use("/games", gameRoutes);
app.use("/games/:id/comments", commentRoutes);
app.use("/", landingRoutes);
app.use("/", authRoutes);

//listen
app.listen(process.env.PORT || 3000, () => {
	console.log("yelp_games is running...")
})