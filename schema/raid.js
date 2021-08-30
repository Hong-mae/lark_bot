const mongoose = require('mongoose')

const raid_schema = new mongoose.Schema({
	guildId: {
		type: [String],
		required: true,
	},
	raidId: {
		type: Number,
		required: true,
	},
	type: {
		type: Number,
		required: true,
	},
	boss: {
		type: String,
		required: true,
	},
	level: {
		type: String,
		required: true,
	},
	leader: {
		type: String,
		required: true,
	},
	member: {
		type: [String],
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	detail: {
		type: String,
		default: '세부정보가 없습니다',
	},
})

module.exports = mongoose.model('raid', raid_schema)
