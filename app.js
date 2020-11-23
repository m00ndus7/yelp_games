//==========================
//Imports
//==========================
//NPM
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

//Config
const config = require("./config");

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
mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//Express config
app.set("view engine", "ejs");
app.use(express.static("public"));

//Express Session Config
app.use(expressSession({
	secret: "hrgheg;sohg;hga;grgliuaggerkhjgk",
	resave: false,
	saveUninitialized: false
}));

//body parser
app.use(bodyParser.urlencoded({extended: true}));

//override
app.use(methodOverride("_method"));

//Passport Config
app.use(passport.initialize());
app.use(passport.session()); //persistent sessiions
passport.serializeUser(User.serializeUser()); //what data should be stored
passport.deserializeUser(User.deserializeUser()); // get user data from session
passport.use(new localStrategy(User.authenticate())); //use local strategy

//current user middleware
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

//route config
app.use("/games", gameRoutes);
app.use("/games/:id/comments", commentRoutes);
app.use("/", landingRoutes);
app.use("/", authRoutes);

//listen
app.listen(3000, () => {
	console.log("yelp_games is running...")
})