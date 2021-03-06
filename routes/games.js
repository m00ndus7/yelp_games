const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const Comment = require('../models/comment');
const isLoggedIn = require("../utils/isLoggedIn");
const checkGameOwner = require("../utils/checkGameOwner");

//index
router.get("/", async (req, res) =>{
	try {
		const games = await Game.find().exec();
		res.render("games", {games});
	} catch(err) {
		console.log(err);
		res.send("you broke it... /index");
	}
});

//create
router.post("/", isLoggedIn, async (req, res) => {
	const genre = req.body.genre.toLowerCase();
	const newGame = {
		title: req.body.title,
		description: req.body.description,
		creators: req.body.creators,
		publisher: req.body.publisher,
		date: req.body.date,
		genre,
		multiplayer: !!req.body.multiplayer,
		image_link: req.body.image_link,
		owner:{
			id: req.user._id,
			username: req.user.username
		},
		upvotes: [],
		downvotes: [],
	}
	
	try {
		const game = await Game.create(newGame);
		req.flash("success", "Game created");
		res.redirect("/games/" + game._id);
	} catch(err) {
		req.flash("error", "Error creating game");
		res.redirect("/games")
	}
});

//new
router.get("/new", isLoggedIn, (req, res) => {
	res.render("games_new");
});

//search
router.get("/search", async (req, res) => {
	try {
		const games = await Game.find({
			$text: {
				$search: req.query.term
			}
		});
		res.render("games", {games});
	} catch(err) {
		console.log(err);
		res.send("Broken search")
	}
});

//Genre
router.get("/genre/:genre", async (req, res) => {
	const validGenres = ["fighting", "fps", "board-games", "puzzle", "rpg", "mmo"];
	if(validGenres.includes(req.params.genre.toLowerCase())) {
		const games = await Game.find({genre: req.params.genre}).exec();
		res.render("games", {games});
	} else {
		res.send("Please enter a valid genre")
	}
});

// Vote
router.post("/vote", isLoggedIn, async (req, res) => {
	console.log("Request body:", req.body);
	
	const game = await Game.findById(req.body.gameId)
	const alreadyUpvoted = game.upvotes.indexOf(req.user.username)
	const alreadyDownvoted = game.downvotes.indexOf(req.user.username)
	
	let response = {};
	
	if(alreadyUpvoted === -1 && alreadyDownvoted === -1) {
		if (req.body.voteType === "up") {
			game.upvotes.push(req.user.username);
			game.save()
			response = {message: "upvote tallied", code: 1}
		} else if (req.body.voteType === "down") {
			game.downvotes.push(req.user.username);
			game.save()
			response = {message: "downvote tallied", code: -1}
		} else {
			response = {message: "Error 1", code: "err"}
		}
	} else if (alreadyUpvoted >= 0) {
		if(req.body.voteType === "up") {
			game.upvotes.splice(alreadyUpvoted, 1);
			game.save();
			response = {message: "upvote removed", code: 0}
		} else if (req.body.voteType === "down") {
			game.upvotes.splice(alreadyUpvoted, 1);
			game.downvotes.push(req.user.username);
			game.save();
			response = {message: "changed to downvote", code: -1}
		} else {
			response = {message: "Error 2", code: "err"}
		}
		
	} else if (alreadyDownvoted >= 0) {
		if(req.body.voteType === "down") {
			game.downvotes.splice(alreadyDownvoted, 1);
			game.save();
			response = {message: "downvote removed", code: 0}
		} else if (req.body.voteType === "up") {
			game.downvotes.splice(alreadyDownvoted, 1);
			game.downvotes.push(req.user.username);
			game.save();
			response = {message: "changed to upvote", code: 1}
		} else {
			response = {message: "Error 3", code: "err"}
		}
	} else {
		response = {message: "Error 4", code: "err"}
	}
	
	response.score = game.upvotes.length - game.downvotes.length;

	res.json(response);
});

//show
router.get("/:id", async (req, res) =>{
	try {
	console.log("Params:", req.params)
		const game = await Game.findById(req.params.id).exec();
	const comments = await Comment.find({gameId: req.params.id});
	res.render("games_show", {game, comments})
	} catch(err) {
		console.log(err);
		res.send("broke /games/id");
	}
});

//edit
router.get("/:id/edit", checkGameOwner, async (req, res) => {
	const game = await Game.findById(req.params.id).exec();
	res.render("games_edit", {game})
});

//update
router.put("/:id", checkGameOwner, async (req, res) => {
	const genre = req.body.genre.toLowerCase();
	const gameBody = {
		title: req.body.title,
		description: req.body.description,
		creators: req.body.creators,
		publisher: req.body.publisher,
		date: req.body.date,
		genre,
		multiplayer: !!req.body.multiplayer,
		image_link: req.body.image_link
	}
	try {
		const game = await Game.findByIdAndUpdate(req.params.id, gameBody, {new: true}).exec();
		req.flash("success", "Game updated");
	res.redirect(`/games/${req.params.id}`)
	} catch (err) {
		console.log(err);
		req.flash("error", "Error updating");
		res.redirect("/games");
	}
});

//delete
router.delete("/:id", checkGameOwner, async (req, res) => {
	try {
		const deleteGame = await 	Game.findByIdAndDelete(req.params.id).exec();
		req.flash("success", "Game deleted");
		res.redirect("/games");
	} catch (err) {
		console.log(err);
		req.flash("error", "Error deleting game")
		res.redirect("back");
	}
});

module.exports = router;