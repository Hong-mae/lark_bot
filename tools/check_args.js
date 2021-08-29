const dayjs = require('dayjs')
require('dayjs/locale/ko')

module.exports = async (args, boss) => {
	// 난이도 관련
	switch (args[0]) {
		case '노말':
		case '하드':
		case '헬':
		case '리허설':
		case '데자뷰':
			break
		default:
			throw 'wrongLevel'
	}

	const no_rehearsal = new RegExp('(발탄|비아키스)')
	if (no_rehearsal.test(boss)) {
		throw 'wrongLevel'
	}
	/////////////

	// 날짜 관련
	if (!args[1]) throw 'needDate'

	var dateRegexp = new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}')
	var now = dayjs().format('YYYY-MM-DD')
	var target = dayjs(args[1]).format('YYYY-MM-DD')
	if (!dateRegexp.test(args[1])) throw 'wrongDate'
	else if (now > target) throw `tooSmallDate`
	///////////

	// 시간 관련
	if (!args[2]) throw 'needTime'

	var timeRegexp = new RegExp('([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])')
	if (!timeRegexp.test(args[2])) throw 'wrongTime'
	///////////
}
