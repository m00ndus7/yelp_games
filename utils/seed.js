const Game = require("../models/game");
const Comment = require("../models/comment");

const game_seeds = [
	{
		title: "RiME",
		description: "I'm baby bespoke cold-pressed blue bottle forage copper mug, ugh stree...",
		creators:"Raúl Rubio Munárriz, Remy Chinchilla, Kevin Sardà Pérez, Carlos M. Váz...",
		publisher: "Grey Box, Six Foot",
		date: "2017-05-26",
		genre: "puzzle",
		multiplayer: false,
		image_link: "",
	},
	{
		title: "Abzû",
		description:"I'm baby bespoke cold-pressed blue bottle forage copper mug, ugh stree...",
		creators: "AAAAAAAAAA",
		publisher: "505 Games",
		date: "2016-08-02",
		genre: "puzzle",
		multiplayer: false,
		image_link: "",
	},
	{
		title: "Life is Strange",
		description: "I'm baby bespoke cold-pressed blue bottle forage copper mug, ugh stree...",
		creators: "AAAAAAAAAA",
		publisher: "Square Enix",
		date: "2015-01-30",
		genre: "puzzle",
		multiplayer: false,
		image_link: "",
	},
];

const seed = async () => {
	try {await Game.deleteMany();
	console.log("Deleted all the games");
	
	await Comment.deleteMany();
	console.log("Deleted all the comments");
	
//	for(const game_seed of game_seeds) {
//		let game = await Game.create(game_seed);
//		console.log("Created new game:", game.title);
//		await Comment.create({
//			text: "I loved this game!",
//			user: "person",
//			gameId: game._id
//		})
//		console.log("created a new comment")
//	}
		}
	catch(err) {
		console.log(err);
	}
}

module.exports = seed;