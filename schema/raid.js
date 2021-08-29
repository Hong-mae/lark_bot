const moongoose = require('mongoose')

const raid_schema = new moongoose.Schema({
	guildId: {
		type: String,
		required: true,
	},
})
