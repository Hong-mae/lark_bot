const axios = require('axios')
const cheerio = require('cheerio')
const randColor = require('../tools/rand_color')
const Discord = require('discord.js')
const fs = require('fs')

const LOA_URL = 'https://m-lostark.game.onstove.com'

const pre_builder = async (nickname) => {
	const PROFILE_URL = `${LOA_URL}/Profile/Character/${encodeURI(nickname)}`
	const response = await axios.get(PROFILE_URL, {})

	if (response.data.includes('캐릭터 정보가 없습니다.'))
		throw 'notExistCharacter'

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

const search_equipment_by_nickname = async (nickname, type = 'default') => {
	const { PROFILE_URL, html_parse: $ } = await pre_builder(nickname)

	// 장착 아이템 정보

	/**
	 * 1차 분류
	 * 0 = 무기, 1 = 머리장식, 2 = 상의
	 * 3 = 하의, 4 = 장갑, 5 = 견갑
	 * 6 = 목걸이, 7 = 귀걸이, 8 = 귀걸이
	 * 9 = 반지, 10 = 반지, 11 = 어빌리티 스톤
	 *
	 * 2차 분류
	 * 0 = 아이템 명
	 * 1 = 아이템 기본정보 // 품질, 강화, 템렙
	 * 8 = 트라이포드 정보
	 */

	const item = new Discord.MessageEmbed()

	item.setColor(randColor()).setAuthor(
		`${nickname}의 ${type === 'default' ? '장비' : '악세서리'} 정보입니다.`,
		'',
		PROFILE_URL
	)

	const equip = JSON.parse(
		$('#profile-ability > script')
			.html()
			.replace('$.Profile = ', '')
			.replace(/\;\s*$/, '')
	).Equip

	if (type === 'default') {
		Object.keys(equip).map((e, i) => {
			if (i >= 6) return

			const target = equip[e]

			item.addField(
				'강화',
				$(target['Element_000'].value)
					.text()
					.match(/\+[0-9]{2}/) ?? '-',
				true
			)

			const equip_type = $(target['Element_001'].value.leftStr0).text()
			const equip_name = $(target['Element_000'].value)
				.text()
				.substring(4)
			item.addField(equip_type, equip_name, true)

			let qualityValue = parseInt(
				target['Element_001'].value.qualityValue
			)

			if (qualityValue <= 10) {
				qualityValue += ' :red_square:'
			} else if (qualityValue <= 30) {
				qualityValue += ' :yellow_square:'
			} else if (qualityValue <= 70) {
				qualityValue += ' :green_square:'
			} else if (qualityValue <= 90) {
				qualityValue += ' :blue_square:'
			} else if (qualityValue <= 99) {
				qualityValue += ' :purple_square:'
			} else {
				qualityValue += ' :orange_square:'
			}

			item.addField('품질', qualityValue, true)
		}) // 장비 정보
	} else if (type === 'accessory') {
		// 2차분류
		// 6 = 추가옵션(치특신제인숙) - 어빌리티 스톤의 경우 각인정보
		// 7 = 각인

		Object.keys(equip).map((e, i) => {
			if (i <= 5 || i >= 12) return

			const target = equip[e]

			const equip_type = $(target['Element_001'].value.leftStr0).text()
			const equip_name = $(target['Element_000'].value).text()

			item.addField(equip_type, equip_name, true)

			let qualityValue = parseInt(
				target['Element_001'].value.qualityValue
			)

			if (qualityValue <= 10) {
				qualityValue += ' :red_square:'
			} else if (qualityValue <= 30) {
				qualityValue += ' :yellow_square:'
			} else if (qualityValue <= 70) {
				qualityValue += ' :green_square:'
			} else if (qualityValue <= 90) {
				qualityValue += ' :blue_square:'
			} else if (qualityValue <= 99) {
				qualityValue += ' :purple_square:'
			} else {
				qualityValue += ' :orange_square:'
			}

			item.addField('품질', qualityValue, true)

			if (i !== 11) {
				let additional_option = $(
					`<p>${target['Element_006'].value.Element_001}</p>`
				)
					.text()
					.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2}\s\+[0-9]{1,3}/g)

				let additional_engrave = $(
					target['Element_007'].value.Element_001
				).text()

				item.addField('추가 옵션', additional_option, true)
				item.addField('추가 각인', additional_engrave)
			}
		}) // 악세 정보
	}

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

const search_skill = async (nickname) => {
	const { PROFILE_URL, html_parse: $ } = await pre_builder(nickname)

	const skill = new Discord.MessageEmbed()

	skill
		.setColor(randColor())
		.setAuthor(`${nickname}의 각인 정보입니다.`, '', PROFILE_URL)

	$('.profile-skill__item').each((i, e) => {
		const name = $(e).find('.profile-skill__title').text()
		const lv = $(e).find('.profile-skill__lv > em').text()
		const tripod = []
		$(e)
			.find('.profile-skill__status > span')
			.each((i, e) => {
				tripod.push($(e).text().trim())
			})

		if (parseInt(lv) > 1) {
			skill.addFields(
				{ name: '스킬명', value: name, inline: true },
				{ name: '레벨', value: lv, inline: true },
				{ name: '트포', value: [...tripod, '\u200B'], inline: true }
			)
		}
	})

	return skill
}

module.exports = {
	search_profile,
	search_equipment_by_nickname,
	search_engrave,
	search_skill,
}
