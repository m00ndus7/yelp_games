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
	try{
	const comment = await Comment.create({
		user: {
			id: req.user._id,
			username: req.user.username
		},
		text: req.body.text,
		gameId: req.body.gameId
	});
	req.flash("success", "Comment created");
		res.redirect(`/games/${req.body.gameId}`)
	} catch (err) {
		console.log(err);
		req.flash("error", "error creating comment")
		res.redirect("/games");
	}
});

router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
	try {
		const game = await Game.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		res.render("comments_edit", {game, comment});
	} catch (err) {
		console.log(err);
		res.redirect("/game")
	}
})

router.put("/:commentId", checkCommentOwner, async (req, res) => {
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
		req.flash("success", "Comment edited");
		res.redirect(`/games/${req.params.id}`)
	} catch(err) {
		console.log(err);
		req.flash("error", "error creating comment");
		res.redirect("/games")
	}
});

router.delete("/:commentId", checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		req.flash("success", "Comment deleted");
		res.redirect(`/games/${req.params.id}`);
	} catch(err) {
	console.log(err);
		req.flash("error", "error deleting comment");
		res.redirect("/games")
	}
});

module.exports = router;