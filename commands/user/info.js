const { search_profile } = require('../../tools/crawler')

module.exports = {
	name: '정보',
	description: '캐릭터 정보 검색',
	aliases: ['info'],
	usage: '[로아 닉네임]',
	execute: async (message, args, client) => {
		if (!args[0]) return message.reply('닉네임을 입력해주세요')

		const data = await search_profile(args[0])

		data.map((e) => {
			message.channel.send(data)
		})
	},
}
