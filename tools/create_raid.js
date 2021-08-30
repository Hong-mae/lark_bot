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

const getDescripton = (boss, level) => {
	switch (boss) {
		case '발탄':
			if (level === '노말') return '발탄 노말은 템렙 1415부터 가능합니다.'
			else if (level === '하드')
				return '발탄 하드는 템렙 1445부터 가능합니다'
			else return '발탄 헬은 1445부터 가능하며 조화의 천칭을 이용합니다.'
		case '비아키스':
			if (level === '노말')
				return '비아키스 노말은 템렙 1430부터 가능합니다.'
			else if (level === '하드')
				return '비아키스 하드는 템렙 1460부터 가능합니다'
			else
				return '비아키스 헬은 1460부터 가능하며 조화의 천칭을 이용합니다.'
		case '쿠크세이튼':
			if (level === '리허설')
				return '쿠크세이튼 리허설은 템렙 1380부터 가능합니다.'
			else if (level === '노말')
				return '쿠크세이튼 노말은 템렙 1475부터 가능합니다'
			else return '출시하지 않는 레벨입니다.'
		case '아브렐슈드':
			if (level === '데자뷰')
				return '아브렐슈드 데자뷰는 템렙 1430부터 가능합니다.'
			else if (level === '노말')
				return '아브렐슈드 노말 1~2관문 1490, 3~4관문은 1500, 5~6관문은 1520 입니다.'
			else return '출시하지 않는 레벨입니다.'
	}
}

module.exports = async (gId, leader, type, boss, level, date) => {
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
		raid_model.date = date // 레이드 날짜

		raid_model.detail = getDescripton(boss, level)

		await raid_model.save()

		return raid_model
	} catch (e) {
		throw e
	}
}
