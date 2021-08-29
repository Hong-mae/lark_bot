const dayjs = require('dayjs')
require('dayjs/locale/ko')

module.exports = {
	name: '아브렐슈드',
	description: '아브렐슈드 레이드 신청하기!',
	args: true,
	aliases: ['아브'],
	usage: '[난이도] [날짜] [시간]',
	lod: '데자뷰,노말,하드,헬',
	execute: (message, args) => {
		// 난이도 관련
		switch (args[0]) {
			case '데자뷰':
			case '노말':
			case '하드':
			case '헬':
				break
			default:
				return message.reply('잘못된 난이도 입니다.')
		}
		/////////////
		// 날짜 관련
		if (!args[1]) return message.reply('날짜(YYYY-MM-DD)를 입력해주세요.')

		var dateRegexp = new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}')
		if (!dateRegexp.test(args[1]))
			return message.reply('날짜는 YYYY-MM-DD 형식으로 입력해주세요')
		else if (dayjs() > dayjs(args[1]))
			return message.reply(
				`오늘(${now})보다 이전 날짜는 입력할 수 없습니다.`
			)
		///////////
		// 시간 관련
		if (!args[2])
			return message.reply('시간(HH:mm)을 입력해주세요. - 24시 표기법')

		var timeRegexp = new RegExp('([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])')
		if (!timeRegexp.test(args[2]))
			return message.reply(
				'시간은 HH:mm 24시 표기법 형식으로 입력해주세요'
			)
		///////////
	},
}
