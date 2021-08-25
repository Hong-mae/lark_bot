const Discord = require('discord.js')
const { prefix } = require('../../config.json')

module.exports = {
	name: 'help',
	description: 'List All of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute: (message, args) => {
		const data = new Discord.MessageEmbed()
		const { commands } = message.client

		data.setColor('#0099ff')
		data.setAuthor(
			'우뇽봇',
			'https://cdn.discordapp.com/avatars/874633918530347028/f52d34330231a75b31f9d9b32a633a9c.png'
		)

		if (!args.length) {
			data.setTitle('우뇽봇 명령어다뇽! v1.0')
			data.addFields(
				{
					name: '명령어 목록',
					value: commands.map((command) => command.name).join(', '),
				},
				{ name: '\u200B', value: '\u200B' }
			)
			data.setFooter('자세한 정보는 !help [명령어]로 확인해라뇽!')
			// data.push("Here's a list of all my commands:")
			// data.push(commands.map((command) => command.name).join(', '))
			// data.push(
			// 	`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
			// )

			// return message.author
			// 	.send(data, { split: true })
			// 	.then(() => {
			// 		if (message.channel.type === 'dm') return
			// 		message.reply("I've sent you a DM with all my commands!")
			// 	})
			// 	.catch((error) => {
			// 		console.error(
			// 			`Could not send help DM to ${message.author.tag}.\n`,
			// 			error
			// 		)
			// 		message.reply(
			// 			"it seems like I can't DM you! Do you have DMs disabled?"
			// 		)
			// 	})

			return message.channel.send(data)
		}

		const name = args[0].toLowerCase()
		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name))

		if (!command) {
			return message.reply(`\`${name}\`(은)는 없는 명령어다뇽 ㅠㅡㅠ`)
		}

		data.setTitle(`\`${name}\`의 명령어 사용법이다뇽!`)
		data.addFields(
			{ name: 'Desc.', value: command.description },
			{
				name: '유사 명령어',
				value: command.aliases.join(', '),
				inline: true,
			},
			{
				name: '난이도',
				value: command.lod,
				inline: true,
			},
			{
				name: '사용법',
				value: `${prefix}(${command.aliases.join(', ')}) ${
					command.usage
				}`,
			}
		)
		// data.push(`**명령어:** ${command.name}`)

		// if (command.aliases)
		// 	data.push(`**유사 명령어:** ${command.aliases.join(', ')}`)
		// if (command.description) data.push(`**정의:** ${command.description}`)
		// if (command.usage)
		// 	data.push(`**사용법:** ${prefix}${command.name} ${command.usage}`)

		// data.push(`**쿨타임:** ${command.cooldown || 3} second(s)`)

		message.channel.send(data)
	},
}
