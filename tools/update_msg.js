const msg_schema = require('../schema/msg')
const create_embed = require('../tools/create_embed')

module.exports = async (client, raid_data, type, member) => {
	try {
		msg_schema.find({ raidId: raid_data.raidId }).then(async (msgs) => {
			let embed = await create_embed(client, raid_data, type, member)
			for (const msg of msgs) {
				await client.channels.cache
					.get(msg.chId)
					.messages.fetch(msg.msgId)
					.then(async (message) => await message.edit(embed))
			}
		})
	} catch (err) {
		throw err
	}
}
