const config = require('../config.json')

module.exports = {
	name: 'messageReactionAdd',
	execute: async (reaction, user, client) => {
		if (user.bot) return

		if (reaction.emoji.name === '🤚') {
		}
	},
}
