const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Game = require("../models/game");
const isLoggedIn = require("../utils/isLoggedIn");
const checkCommentOwner = require("../utils/checkCommentOwner");

router.get("/new", isLoggedIn, (req, res) => {
	res.render("comments_new", {gameId: req.params.id})
});

router.post("/", isLoggedIn, async (req, res) => {
	const comment = await Comment.create({
		user: {
			id: req.user._id,
			username: req.user.username
		},
		text: req.body.text,
		gameId: req.body.gameId
	});
	try{
	console.log(comment);
		res.redirect(`/games/${req.body.gameId}`)
	} catch (err) {
		console.log(err);
		res.send("broken post comments");
	}
});

router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
	try {
		const game = await Game.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		console.log("Game:", game)
		console.log("Comment:", comment)
		res.render("comments_edit", {game, comment});
	} catch (err) {
		console.log(err);
		res.send('broke comment edit get')
	}
})

router.put("/:commentId", checkCommentOwner, async (req, res) => {
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
		console.log(comment);
		res.redirect(`/games/${req.params.id}`)
	} catch(err) {
		console.log(err);
		res.send("broke comment pui")
	}
});

router.delete("/:commentId", checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		console.log(comment);
		res.redirect(`/games/${req.params.id}`);
	} catch(err) {
	console.log(err);
		res.send("broken comment delete")
	}
});

module.exports = router;