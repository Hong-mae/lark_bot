const Discord = require('discord.js')
const dayjs = require('dayjs')
const randColor = require('../tools/rand_color')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ko')

const getDetail = (type, leader, boss, level) => {
	switch (type) {
		case 1:
			return `<@${leader}>님께서 ${boss} - ${level} 레이드를 신청하셨습니다.`
	}
}

module.exports = async (client, raid, type) => {
	try {
		const {
			leader,
			boss,
			level,
			party1: p1,
			party2: p2,
			date,
			raidId,
			type: raid_type,
			detail,
		} = raid
		let embed = new Discord.MessageEmbed()
		let party1 = '\u200B',
			party2 = '\u200B'

		const changes = await getDetail(type, leader, boss, level)

		await p1.map((e) => {
			party1 += `<@${e}>`
		})
		await p2.map((e) => {
			party2 += `<@${e}>`
		})

		embed.setColor(randColor())
		embed.setAuthor('우뇽이의 레이드 정보')
		embed.setThumbnail(
			'https://item.kakaocdn.net/do/a0d6924a4d1018ef019dbe907b0691718f324a0b9c48f77dbce3a43bd11ce785'
		)

		embed.setTitle(`${boss} - ${level} 레이드 모집중`)
		embed.setDescription(detail)
		embed
			.addField(
				'시작 시각',
				dayjs(date).format('YYYY년 MM월 DD일 a hh시 mm분'),
				true
			)
			.addField('레이드 ID', raidId, true)
			.addField('공대장', `<@${leader}>`, true)
			.addField('1파티', party1, true)
			.addField('2파티', party2, true)
			.setFooter(`참여방법: 🤚를 누르거나 !참여 ${raidId}`)
			.setTimestamp()

		if (changes) embed.addField('변경 사항', changes)

		return embed
	} catch (e) {
		console.error(e)
		throw e
	}
}
