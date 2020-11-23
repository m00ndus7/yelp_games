const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
	},
	text: String,
	gameId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Game"
	}
});

module.exports = mongoose.model("comment", commentSchema);