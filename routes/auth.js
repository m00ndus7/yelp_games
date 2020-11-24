const express= require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/signup", (req, res) => {
	res.render("signup");
});

router.post("/signup", async (req, res) => {
	try {
		const newUser = await User.register(new User({
			username: req.body.username,
			email: req.body.email
		}), req.body.password);
		
		console.log(newUser);
		
		passport.authenticate("local")(req, res, () => {
			res.redirect("/games");
		});
	} catch (err) {
		console.log(err),
		res.send(err);
}
});

//Login - show form
router.get("/login", (req, res) => {
	res.render("login", {message: req.flash("error")});
});

//Login
router.post("/login", passport.authenticate('local', {
	successRedirect: "/games",
	failureRedirect: "/login"
}));

//Logout
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/games")
});

module.exports = router;