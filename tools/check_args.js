const dayjs = require('dayjs')
const check_time = require('./check_time')

module.exports = async (args, boss) => {
	// 난이도 관련
	switch (args[0]) {
		case '노말':
		case '하드':
		case '헬':
		case '리허설':
		case '데자뷰':
			// const no_rehearsal = new RegExp('(발탄|비아키스)')
			// if (no_rehearsal.test(boss)) {
			// 	throw 'wrongLevel'
			// }
			break
		default:
			throw 'wrongLevel'
	}

	if (
		['발탄', '비아키스'].includes(boss) &&
		['리허설', '데자뷰'].includes(args[0])
	) {
		throw 'wrongLevel'
	}

	if (boss === '쿠크세이튼' && args[0] === '데자뷰') throw 'wrongLevel'
	if (boss === '비아키스' && args[0] === '리허설') throw 'wrongLevel'
	/////////////

	// 날짜 관련
	let _date = args.filter((e, i) => {
		if (i === 0) return
		return e
	})

	const date = check_time(_date.join(' '))

	return {
		level: args[0],
		date: date,
	}
}
