const check_args = require('../../tools/check_args')
const error_handler = require('../../tools/error_handler')

module.exports = {
	name: '발탄',
	description: '발탄 레이드 신청하기!',
	args: true,
	aliases: [],
	usage: '[난이도] [날짜] [시간]',
	lod: '노말,하드,헬',
	execute: async (message, args) => {
		try {
			await check_args(args, message.content)
		} catch (e) {
			// console.log(error_handler(e))
			return message.reply(await error_handler(e))
		}
	},
}
