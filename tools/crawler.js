const axios = require('axios')
const cheerio = require('cheerio')
const randColor = require('../tools/rand_color')
const Discord = require('discord.js')
const fs = require('fs')

const LOA_URL = 'https://m-lostark.game.onstove.com'

const pre_builder = async (nickname) => {
	const PROFILE_URL = `${LOA_URL}/Profile/Character/${encodeURI(nickname)}`
	const response = await axios.get(PROFILE_URL, {})

	const html_parse = cheerio.load(response.data)

	return { PROFILE_URL, html_parse }
}

const search_profile = async (nickname) => {
	const { PROFILE_URL, html_parse: $ } = await pre_builder(nickname)

	const info = new Discord.MessageEmbed()

	// 기본적인 캐릭터 정보
	const _thumb = $('dl.myinfo__badge > dd > img').attr('src')
	const _server = $(
		'.myinfo__character > div.wrapper-define > dl:nth-child(1) > dd'
	)
		.text()
		.replace('@', '')
	const _nick = $('button.myinfo__character--button2').text().split(' ')[1]
	const _level = $('button.myinfo__character--button2').text().split(' ')[0]
	const _class = $(
		'.myinfo__character > div.wrapper-define > dl:nth-child(2) > dd'
	).text()
	const _guild = $('.guild-name').text()
	const _item_lv = $('dl.item > .level').text()
	const _title = $(
		'div.myinfo__contents-level > div:nth-child(1) > dl:nth-child(2) > dd'
	).text()
	const _pvp = $(
		'div.myinfo__contents-level > div:nth-child(3) > dl:nth-child(2) > dd'
	).text()
	const _wisdom = $(
		'div.myinfo__contents-level > div:nth-child(4) > dl > dd'
	).text()

	info.setColor(randColor())
		.setAuthor(`${nickname}의 검색 결과입니다.`, '', PROFILE_URL)
		.setThumbnail(_thumb)
		.addFields(
			{ name: '서버', value: _server, inline: true },
			{ name: '닉네임', value: _nick, inline: true },
			{ name: '클래스', value: _class, inline: true },
			{ name: '길드', value: _guild, inline: true },
			{ name: '칭호', value: _title, inline: true },
			{ name: '영지', value: _wisdom, inline: true },
			{ name: '전투 Lv', value: _level, inline: true },
			{ name: '아이템 Lv', value: 'Lv.' + _item_lv, inline: true },
			{ name: 'PVP', value: _pvp, inline: true }
		)
		.setFooter(
			'아이템 정보: 🍎를 누르거나 !정보 [캐릭터명] 장비\n각인 정보: 🍏를 누르거나 !정보 [캐릭터명] 각인'
		)

	return info
	////////////////////
}

const search_equipment_by_nickname = async (nickname) => {
	const { PROFILE_URL, html_parse: $ } = await pre_builder(nickname)

	// 장착 아이템 정보
	const item = new Discord.MessageEmbed()

	item.setColor(randColor()).setAuthor(
		`${nickname}의 장비 정보입니다.`,
		'',
		PROFILE_URL
	)

	const equip = JSON.parse(
		$('#profile-ability > script')
			.html()
			.replace('$.Profile = ', '')
			.replace(/\;\s*$/, '')
	).Equip

	Object.keys(equip).map((e, i) => {
		if (i >= 6) return
		/**
		 * 1차 분류
		 * 0 = 무기
		 * 1 = 머리장식
		 * 2 = 상의
		 * 3 = 하의
		 * 4 = 장갑
		 * 5 = 견갑
		 *
		 * 2차 분류
		 * 0 = 아이템 명
		 * 1 = 아이템 기본정보 // 품질, 강화, 템렙
		 * 8 = 트라이포드 정보
		 */

		const target = equip[e]

		item.addField(
			'강화',
			$(target['Element_000'].value)
				.text()
				.match(/\+[0-9]{2}/) ?? '',
			true
		)

		switch (i) {
			case 0:
				item.addField(
					'무기',
					$(target['Element_000'].value).text().substring(4),
					true
				)
				break
			case 1:
				item.addField(
					'머리장식',
					$(target['Element_000'].value).text().substring(4),
					true
				)
				break
			case 2:
				item.addField(
					'상의',
					$(target['Element_000'].value).text().substring(4),
					true
				)
				break
			case 3:
				item.addField(
					'하의',
					$(target['Element_000'].value).text().substring(4),
					true
				)
				break
			case 4:
				item.addField(
					'장갑',
					$(target['Element_000'].value).text().substring(4),
					true
				)
				break
			case 5:
				item.addField(
					'견갑',
					$(target['Element_000'].value).text().substring(4),
					true
				)
				break
			default:
				return
		}

		let qualityValue = parseInt(target['Element_001'].value.qualityValue)

		if (qualityValue <= 10) {
			qualityValue += ' :red_square:'
		} else if (qualityValue <= 30) {
			qualityValue += ' :yellow_square:'
		} else if (qualityValue <= 70) {
			qualityValue += ' :green_square:'
		} else if (qualityValue <= 90) {
			qualityValue += ' :blue_square:'
		} else {
			qualityValue += ' :purple_square:'
		}
		item.addField('품질', qualityValue, true)
	})

	return item
}

const search_engrave = async (nickname) => {
	const { PROFILE_URL, html_parse: $ } = await pre_builder(nickname)

	const engrave = new Discord.MessageEmbed()

	engrave
		.setColor(randColor())
		.setAuthor(`${nickname}의 각인 정보입니다.`, '', PROFILE_URL)

	// 각인 정보
	$('.profile-ability-engrave > ul > li').each((i, e) => {
		engrave.addField($(e).find('span').text(), $(e).find('p').text())
	})
	///////////

	return engrave
}

module.exports = {
	search_profile,
	search_equipment_by_nickname,
	search_engrave,
}
