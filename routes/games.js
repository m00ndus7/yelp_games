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
		}
	}
	
	try {
		const game = await Game.create(newGame);
		console.log(game);
		res.redirect("/games/" + game._id);
	} catch(err) {
		console.log(err);
		res.send("broke");
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
	res.redirect(`/games/${req.params.id}`)
	} catch (err) {
		console.log(err);
		res.send("broke put");
	}
});

//delete
router.delete("/:id", checkGameOwner, async (req, res) => {
	try {
		const deleteGame = await 	Game.findByIdAndDelete(req.params.id).exec();
		console.log("Deleted", deleteGame);
		res.redirect("/games");
	} catch (err) {
		console.log(err);
		res.send("broke, delete");
	}
});

module.exports = router;