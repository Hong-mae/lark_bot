const cron = require('node-cron')
const raid_schema = require('../schema/raid')
const msg_schema = require('../schema/msg')
const dayjs = require('dayjs')

// 기간이 지난 레이드 삭제기간 설정
module.exports = () => {
	cron.schedule('* */3 * * *', async () => {
		const now = dayjs()
		raid_schema
			.find({
				date: { $lt: now },
			})
			.then(async (raids) => {
				for (const raid of raids)
					await msg_schema.deleteMany({ raidId: raid.raidId })

				await raid_schema.deleteMany({
					date: { $lt: now },
				})
			})
	})
}
