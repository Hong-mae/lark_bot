const error_handler = require('../../tools/error_handler')
const check_args = require('../../tools/check_args')
const create_raid = require('../../tools/create_raid')
const create_embed = require('../../tools/create_embed')
const create_msg = require('../../tools/create_msg')

module.exports = {
	name: '아브렐슈드',
	description: '아브렐슈드 레이드 신청하기!',
	args: true,
	aliases: ['아브'],
	usage: '[난이도] [일정(MM월 DD일 오전(오후) hh시 mm분)]',
	execute: async (message, args, client) => {
		try {
			// args 체크
			const { level, date } = await check_args(args, '아브렐슈드')

			// 레이드 정보 생성
			const raid_info = await create_raid(
				message.guild.id,
				message.member.user.id,
				8,
				'아브렐슈드',
				level,
				date
			)

			const embed = await create_embed(client, raid_info, 1)
			let msg = await message.channel.send(embed)
			await create_msg(
				msg.guild.id,
				msg.channel.id,
				msg.id,
				raid_info.raidId
			)
			await msg.react('🤚')
		} catch (e) {
			return message.reply(await error_handler(e))
		}
	},
}
