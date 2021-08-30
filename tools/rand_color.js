const { customAlphabet } = require('nanoid')

const nanoid = customAlphabet('0123456789ABDCEF', 6)

module.exports = () => {
	let color_code = nanoid()

	return `#${color_code}`.toUpperCase()
}
