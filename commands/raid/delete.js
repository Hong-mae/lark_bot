const error_handler = require('../../tools/error_handler')
const raid_schema = require('../../schema/raid')
const msg_schema = require('../../schema/msg')

module.exports = {
	name: '삭제',
	description: '레이드를 삭제합니다.',
	args: true,
	aliases: ['delete'],
	usage: '[레이드 ID]',
	execute: async (message, args, client) => {
		if (!args[0])
			return message.channel.send('**⚠️삭제할 레이드 ID를 입력해주세요**')

		try {
			const raid = await raid_schema.findOne({ raidId: args[0] })

			if (!raid) throw 'notExist'
			if (raid.leader !== message.author.id) throw 'notLeader'

			raid_schema.deleteOne({ raidId: args[0] }).then(async () => {
				await msg_schema.deleteOne({ raidId: args[0] })

				message.channel.send(
					`**:white_check_mark: 레이드(${args[0]})이 정상적으로 삭제되었습니다.**`
				)
			})
		} catch (e) {
			let errMsg = await error_handler(e)
			return message.channel.send(errMsg)
		}
	},
}
