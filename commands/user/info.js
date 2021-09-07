const {
	search_profile,
	search_equipment_by_nickname,
	search_engrave,
} = require('../../tools/crawler')

module.exports = {
	name: '정보',
	description: '캐릭터 정보 검색',
	aliases: ['info'],
	usage: '[로아 닉네임]',
	execute: async (message, args, client) => {
		if (!args[0]) return message.reply('닉네임을 입력해주세요')

		switch (args[1]) {
			case '장비':
			case '아이템':
				const _equip = await search_equipment_by_nickname(args[0])

				message.channel.send(_equip)
				break
			case '각인':
				const _engrave = await search_engrave(args[0])

				message.channel.send(_engrave)
				break
			case '기본':
			default:
				const _default = await search_profile(args[0])

				const msg = await message.channel.send(_default)
				await msg.react('🍎') // 아이템 정보 보기용
				await msg.react('🍏')
				break
		}
	},
}
