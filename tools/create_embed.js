const Discord = require('discord.js')
const dayjs = require('dayjs')
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
		const { leader, boss, level, party1: p1, party2: p2, time } = raid
		let embed = new Discord.MessageEmbed()
		let party1 = '',
			party2 = ''

		const detail = await getDetail(type, leader, boss, level)

		await p1.map((e) => {
			party1 += `<@${e}>`
		})
		await p2.map((e) => {
			party2 += `<@${e}>`
		})

		embed.setAuthor('우뇽이의 레이드 정보')
		embed.setThumbnail(
			'https://item.kakaocdn.net/do/a0d6924a4d1018ef019dbe907b0691718f324a0b9c48f77dbce3a43bd11ce785'
		)

		embed.setTitle(
			`${dayjs(time)
				.tz('Asia/Seoul')
				.format(
					'MM월 DD일 a h시 mm분'
				)} ${boss} - ${level} 레이드 모집중`
		)
		embed.addField(
			'시작 시각',
			`${dayjs(time).tz('Asia/Seoul').format('MM월 DD일 a h시 mm분')}`,
			true
		)

		return embed
	} catch (e) {
		console.error(e)
		throw e
	}
}
