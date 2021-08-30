const { remove_member } = require('../../tools/manage_member')
const create_embed = require('../../tools/create_embed')
const update_msg = require('../../tools/update_msg')
const create_msg = require('../../tools/create_msg')
const error_handler = require('../../tools/error_handler')

module.exports = {
	name: '나가기',
	description: '레이드에서 나가기',
	args: true,
	aliases: ['불참', 'leave'],
	usage: '[레이드 ID]',
	execute: async (message, args, client) => {
		if (!args[0])
			return message.channel.send('**⚠️나가실 레이드 ID를 입력해주세요**')
		try {
			let raid_data = await remove_member(
				message.guild.id,
				args[0],
				message.member.id
			)
			let embed = await create_embed(
				client,
				raid_data,
				3,
				message.member.id
			)
			let msg = await message.channel.send(embed)
			await create_msg(
				msg.guild.id,
				msg.channel.id,
				msg.id,
				raid_data.raidId
			)
			await update_msg(client, raid_data, 3, message.member.id)
			return msg.react('🤚')
		} catch (err) {
			let errMsg = await error_handler(err)
			return message.channel.send(errMsg)
		}
	},
}
