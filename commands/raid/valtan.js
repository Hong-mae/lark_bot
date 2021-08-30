const error_handler = require('../../tools/error_handler')
const check_args = require('../../tools/check_args')
const create_raid = require('../../tools/create_raid')
const create_embed = require('../../tools/create_embed')

module.exports = {
	name: '발탄',
	description:
		'발탄 레이드 신청하기! - 난이도만 입력하면 오늘 오후 8시로 고정됩니다.',
	args: true,
	aliases: [],
	usage: '[난이도] (MM월 DD일 오전(오후) hh시 mm분)',
	lod: '노말,하드,헬',
	execute: async (message, args, client) => {
		try {
			// args 체크
			const { level, date } = await check_args(args, '발탄')

			// 레이드 정보 생성
			const raid_info = await create_raid(
				message.guild.id,
				message.member.user.id,
				8,
				'발탄',
				level,
				date.format()
			)

			const embed = await create_embed(client, raid_info, 1)
			let msg = await message.channel.send(embed)
		} catch (e) {
			// console.log(error_handler(e))
			console.log(e)
			return message.reply(await error_handler(e))
		}
	},
}
