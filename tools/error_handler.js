const dayjs = require('dayjs')

module.exports = async (err) => {
	let errMsg
	switch (err) {
		case 'wrongLevel':
			errMsg = '잘못된 난이도 입니다.'
			break
		case 'wrongDate':
			errMsg = '올바른 일정(YYYY-MM-DD)를 입력해주세요'
			break
		case 'tooSmallDate':
			errMsg = `현재(${dayjs().format(
				'YYYY년 MM월 DD일 a hh시 mm분'
			)})보다 이전 날짜를 입력할 수 없습니다.`
			break
		default:
			errMsg = err
			break
	}

	errMsg = '**⚠ ' + errMsg + '**'

	return errMsg
}
