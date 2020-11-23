const Game = require("../models/game")

const checkGameOwner = async (req, res, next) => {
	if(req.isAuthenticated()) {
		const game = await Game.findById(req.params.id).exec();
		if(game.owner.id.equals(req.user._id)){
			next();
		} else {
			res.redirect("back");
		}
	} else {
	res.redirect("/login")
	};
}

module.exports = checkGameOwner;