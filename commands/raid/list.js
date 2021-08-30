const create_embed = require('../../tools/create_embed')
const update_msg = require('../../tools/update_msg')
const create_msg = require('../../tools/create_msg')
const error_handler = require('../../tools/error_handler')

const raid_schema = require('../../schema/raid')

module.exports = {
	name: '목록',
	description: '레이드 목록보기',
	aliases: ['list'],
	usage: '{보스명}',
	execute: async (message, args, client) => {
		let filter = {}

		switch (args[0]) {
			case '발탄':
			case '비아키스':
			case '쿠크세이튼':
			case '아브렐슈드':
				filter = { boss: args[0] }
				break
			case '비아':
				filter = { boss: '비아키스' }
				break
			case '쿠크':
				filter = { boss: '쿠크세이튼' }
				break
			case '아브':
				filter = { boss: '아브렐슈드' }
				break
		}

		const lists = await raid_schema
			.find({
				$or: [{ status: '모집중' }, { status: '모집종료' }],
				$and: [filter],
			})
			.sort({ boss: 1 })

		if (list.length === 0) {
			return message.channel.send(`**⚠ 모집 중인 레이드가 없습니다**`)
		}

		try {
			for (const list of lists) {
				let embed = await create_embed(client, list, 0, null, true)
				let msg = await message.channel.send(embed)
				await create_msg(
					msg.guild.id,
					msg.channel.id,
					msg.id,
					list.raidId
				)
				await msg.react('🤚')
			}
		} catch (err) {
			let errMsg = await error_handler(err)
			return message.channel.send(errMsg)
		}
	},
}
