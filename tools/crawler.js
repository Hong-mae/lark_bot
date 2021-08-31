const axios = require('axios')
const cheerio = require('cheerio')
const randColor = require('../tools/rand_color')
const Discord = require('discord.js')
const fs = require('fs')

const LOA_URL = 'https://m-lostark.game.onstove.com'

const search_profile = async (nickname) => {
	const data = []
	const PROFILE_URL = `${LOA_URL}/Profile/Character/${encodeURI(nickname)}`
	const response = await axios.get(PROFILE_URL, {})

	const $ = cheerio.load(response.data)

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
	data.push(info)
	////////////////////

	// 장착 아이템 정보
	const item = new Discord.MessageEmbed()

	const _head = $('#profile-equipment').length
	console.log(_head)

	fs.writeFileSync('./test.html', response.data)

	// item.addFields({ name: '머리', value: _head })

	// data.puseh(item)
	return data
}

module.exports = { search_profile }
