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
		case 'notExist':
			errMsg = `생성된 레이드가 없습니다.`
			break
		case 'fullMember':
			errMsg = '모집 인원이 완료되었습니다.'
			break
		case 'existMember':
			errMsg = '이미 참여중인 레이드입니다.'
			break
		case 'raidLeader':
			errMsg =
				'공대장은 레이드에서 나갈 수 없습니다. 공대장을 변경해주세요'
			break
		case 'notMember':
			errMsg = '레이드에 참여중인 멤버가 아닙니다.'
			break
		case 'notExistLevel':
			errMsg = '존재하지 않는 레이드 레벨입니다.'
			break
		case 'pageError':
			errMsg = '페이지를 찾을 수 없거나 점검 중 입니다.'
			break
		case 'notExistCharacter':
			errMsg = '캐릭터를 찾을 수 없습니다.'
			break
		default:
			errMsg = err
			break
	}

	errMsg = '**⚠ ' + errMsg + '**'

	return errMsg
}
