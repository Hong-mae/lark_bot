const dayjs = require('dayjs')

module.exports = async (err) => {
	let errMsg
	switch (err) {
		case 'wrongLevel':
			errMsg = '잘못된 난이도 입니다.'
			break
		case 'needDate':
			errMsg = '날짜(YYYY-MM-DD) 정보를 입력해주세요.'
			break
		case 'wrongDate':
			errMsg = '올바른 날짜(YYYY-MM-DD)를 입력해주세요'
			break
		case 'tooSmallDate':
			errMsg = `오늘(${dayjs().format(
				'YYYY-MM-DD'
			)})보다 이전 날짜를 입력할 수 없습니다.`
			break
		case 'needTime':
			errMsg = '시간(HH:MM) 정보를 입력해주세요. - 24시 표기법'
			break
		case 'wrongTime':
			errMsg = '올바를 시간(HH:MM)을 입력해주세요 - 24시 표기법'
			break
		default:
			errMsg = err
			break
	}

	errMsg = '**⚠ ' + errMsg + '**'

	return errMsg
}
