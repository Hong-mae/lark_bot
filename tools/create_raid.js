const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')

const { customAlphabet } = require('nanoid')
const raid_schema = require('../schema/raid')
const raid = require('../schema/raid')

const nanoid = customAlphabet('123456789', 6)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ko')

module.exports = async (gId, leader, type, boss, level, time) => {
	try {
		const raid_model = new raid_schema()
		let raidId

		while (1) {
			raidId = await nanoid()
			if (await raid_schema.exists({ raidId })) continue
			else break
		}

		raid_model.guildId = [gId]
		raid_model.raidId = raidId

		raid_model.type = type // 4인, 8인 레이드
		raid_model.boss = boss // 보스명
		raid_model.level = level // 난이도

		raid_model.leader = leader // 공대장
		raid_model.party1 = [leader] // 1파티 첫번째는 공대장
		raid_model.time = dayjs(new Date(time)).format() // 레이드 날짜

		await raid_model.save()

		return raid_model
	} catch (e) {
		throw e
	}
}
