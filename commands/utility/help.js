const Discord = require('discord.js')
const { prefix } = require('../../config.json')
const config = require('../../config.json')

module.exports = {
	name: 'help',
	description: 'List All of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute: (message, args, client) => {
		const { commands } = message.client
		let data = []

		if (!args.length) {
			// data.push("Here's a list of all my commands:")
			// data.push(commands.map((command) => command.name).join(', '))
			// data.push(
			// 	`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
			// )
			data.push('**우뇽봇이 알고있는 명령어!**')
			data.push('┃')
			data.push('┝━** 1️⃣ 레이드 관련 명령어 목록 보기 **')
			data.push('┃	 ┣ !help 레이드, !help raid')
			data.push('┃	 ┗ 🍎 클릭')
			data.push('┃')
			data.push('┗━** 2️⃣ 관리자용 명령어 목록 보기 **')
			data.push('		 ┣ !help 레이드, !help raid')
			data.push('		 ┗ 🍏 클릭')
			data.push(' ')
			data.push('*추후 더 많은 명령어 추가 예정*')

			return message.channel.send(data).then(async (m) => {
				m.react('🍎')
				m.react('🍏')
			})
		}

		const name = args[0].toLowerCase()

		if (name === '레이드' || name === 'raid') {
			data.push('**레이드 관련 명령어**')
			data.push('┃')
			data.push('┣━** 1️⃣ 레이드 생성 **')
			data.push('┃	 ┗ ![보스명] [난이도] [날짜] [시간]')
			data.push('┃')
			data.push('┣━** 2️⃣ 레이드 참여 **')
			data.push('┃	 ┗ !참여 [레이드 ID]')
			data.push('┃')
			data.push('┣━** 3️⃣ 레이드 나가기 **')
			data.push('┃	 ┗ !나가기 [레이드 ID]')
			data.push('┃')
			data.push('┗━** 4️⃣ 레이드 목록 **')
			data.push('		 ┗ !목록 [보스명]')

			return message.channel.send(data)
		}

		if (name === '관리자' || name === 'admin') {
			const authorPerms = message.channel.permissionsFor(message.author)
			if (!authorPerms || !authorPerms.has('ADMINISTRATOR')) {
				return message.reply('넌! 사용못한다뇽!!')
			}

			data.push('**관리자용 명령어**')
			data.push('┃')
			data.push('┗━** 1️⃣ 유저 추방 **')
			data.push('		 ┗ !kick [유저맨션]')
			data.push(' ')
			data.push('*추후 더 많은 명령어 추가 예정*')

			return message.channel.send(data)
		}

		// const command =
		// 	commands.get(name) ||
		// 	commands.find((c) => c.aliases && c.aliases.includes(name))

		// if (!command) {
		// 	return message.reply(`\`${name}\`(은)는 없는 명령어다뇽 ㅠㅡㅠ`)
		// }

		// data.push(`**명령어:** ${command.name}`)

		// if (command.aliases.length > 0)
		// 	data.push(`**유사 명령어:** ${command.aliases.join(', ')}`)
		// if (command.description) data.push(`**정의:** ${command.description}`)
		// if (command.usage)
		// 	data.push(`**사용법:** ${prefix}${command.name} ${command.usage}`)

		// data.push(`**쿨타임:** ${command.cooldown || 3} second(s)`)
		// message.channel.send(data)
	},
}
