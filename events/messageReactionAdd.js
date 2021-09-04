const config = require('../config.json')
const msg_schema = require('../schema/msg')
const raid_schema = require('../schema/raid')
const { add_member } = require('../tools/manage_member')
const create_embed = require('../tools/create_embed')
const error_handler = require('../tools/error_handler')
const update_msg = require('../tools/update_msg')
const { search_equipment_by_nickname } = require('../tools/crawler')

module.exports = {
	name: 'messageReactionAdd',
	execute: async (reaction, user, client) => {
		if (user.bot) return

		if (reaction.emoji.name === '🤚') {
			try {
				let msg_data = await msg_schema.findOne({
					guildId: reaction.message.guild.id,
					msgId: reaction.message.id,
				})

				if (!msg_data) return

				let raid_info = await raid_schema.findOne({
					raidId: msg_data.raidId,
				})

				if (!raid_info.member.includes(user.id)) {
					let raid_add_member = await add_member(
						reaction.message.guild.id,
						raid_info.raidId,
						user.id
					)

					let embed = await create_embed(
						client,
						raid_add_member,
						2,
						user.id
					)
					reaction.message.edit(embed)
					await update_msg(client, raid_add_member, 2, user.id)
				}
			} catch (e) {
				let errMsg = await error_handler(e)
				return reaction.message.channel.send(errMsg)
			}
		} else if (reaction.emoji.name === '🍎') {
			let _nick = ''
			reaction.message.embeds[0].fields.map((e) => {
				if (e.name === '닉네임') _nick = e.value
				return
			})

			const data = await search_equipment_by_nickname(_nick)

			reaction.message.channel.send(data)
		}
	},
}
