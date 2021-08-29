const config = require('../config.json')

module.exports = {
	name: 'message',
	execute: (message) => {
		console.log('event-message', message.id)
	},
}
