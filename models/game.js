const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
	title: String,
	description: String,
	creators: String,
	publisher: String,
	date: Date,
	genre: String,
	multiplayer: Boolean,
	image_link: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	},
	upvotes: [String],
	downvotes: [String],
});

gameSchema.index({
	"$**": "text"
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;