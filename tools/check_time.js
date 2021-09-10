const dayjs = require('dayjs')
dayjs.locale('ko')

const regex = {
	time: /[0-9]+시|[0-9]+분|[0-9]+초|오후/g,
	date: /[0-9]+년|[0-9]+월|[0-9]+일/g,
	years: /[0-9]+년/i,
	months: /[0-9]+월/i,
	days: /[0-9]+일/i,
	pm: /^오후/i,
	am: /^오전/i,
	minute: /^[0-9]+분/i,
	hour: /^[0-9]+시(간)?/i,
}

const searchTime = (str) => {
	var pattern = str.match(regex.time),
		times = 0

	if (pattern === null) pattern = ['오후', '8시']

	if (
		(pattern && pattern.length >= 1) ||
		((str.match(regex.am) || str.match(regex.pm)) && str.match(regex.time))
	) {\
		for (var i = 0; i < pattern.length; i++) {
			if (pattern[i].match(regex.pm)) times += 43200000
			if (pattern[i].match(regex.hour))
				times += parseInt(pattern[i]) * 3600000
			if (pattern[i].match(regex.minute))
				times += parseInt(pattern[i]) * 60000
		}

		return times || null
	}
}

const searchDate = (str) => {
	var pattern = str.match(regex.date)

	if (pattern && pattern.length == 3) {
		for (var i = 0; i < pattern.length; i++)
			pattern[i] = parseInt(pattern[i])
	} else {
		pattern = []
		var years = str.match(regex.years),
			months = str.match(regex.months),
			days = str.match(regex.days)

		pattern.push(years ? parseInt(years[0]) : dayjs().year())
		pattern.push(months ? parseInt(months[0]) : dayjs().month() + 1)
		pattern.push(days ? parseInt(days[0]) : dayjs().date())
	}

	return dayjs(pattern.join(' '))
}

module.exports = (str) => {
	const _str = str.trim()

	if (!_str) throw 'wrongDate'

	let time = searchTime(_str)
	let date = searchDate(_str)

	if (time) {
		if (!date) {
			date = new Date()
			date = new Date(
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate()
			)
		}
		date = dayjs(date.unix() * 1000 + time)
	}

	if (dayjs() > date) {
		throw 'tooSmallDate'
	}

	return isNaN(date) ? null : date
}
