const Discord = require('discord.js')
const dayjs = require('dayjs')
const randColor = require('../tools/rand_color')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ko')

const getDetail = (type, member, boss, level) => {
	switch (type) {
		case 1:
			return `<@${member}>님께서 ${boss} - ${level} 레이드를 신청하셨습니다.`
		case 2:
			return `<@${member}>님께서 레이드에 참여했습니다.`
		case 3:
			return `<@${member}>님 께서 레이드에서 나가셨습니다`
	}
}

module.exports = async (client, raid, type, _member = null) => {
	try {
		const {
			leader,
			boss,
			level,
			member,
			date,
			raidId,
			type: raid_type,
			detail,
		} = raid
		let embed = new Discord.MessageEmbed()
		let members = '\u200B'

		const changes = await getDetail(type, _member ?? leader, boss, level)

		members = member.map((e) => `<@${e}>`).join(', ')

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
			.addField(`참여인원 (${member.length}/${raid_type})`, members, true)
			.setFooter(`참여방법: 🤚를 누르거나 !참여 ${raidId}`)
			.setTimestamp()

		if (changes) embed.addField('변경 사항', changes)

		return embed
	} catch (e) {
		console.error(e)
		throw e
	}
}
