const msg_schema = require('../schema/msg')

module.exports = async (guildId, chId, msgId, raidId) => {
	try {
		let msgData = await msg_schema.findOne({ guildId, chId, raidId })
		if (msgData) {
			msgData.msgId = msgId
			await msgData.save()
		} else {
			let msgModel = new msg_schema()
			msgModel.guildId = guildId
			msgModel.chId = chId
			msgModel.msgId = msgId
			msgModel.raidId = raidId
			await msgModel.save()
		}
	} catch (err) {
		throw err
	}
}
