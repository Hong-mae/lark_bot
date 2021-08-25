/*
// const Discord = require('discord.js')
// const client = new Discord.Client()
// client.commands = new Discord.Collection()

// const fs = require('fs')

// const mongoose = require('mongoose')
// const databaseUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}?authSource=${process.env.DATABASE_AUTHSOURCE}`

// mongoose.connect(databaseUrl, {
// 	useUnifiedTopology: true,
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// })

// const db = mongoose.connection

// db.on('error', (error) => {
// 	console.error(error)
// })

// db.once('open', () => {
// 	console.log('Connected to MongoDB Server')
// })

// fs.readdir('./events/', (err, files) => {
// 	if (err) return console.error(err)
// 	files.forEach((file) => {
// 		if (!file.endsWith('.js')) return
// 		const event = require(`./events/${file}`)
// 		let eventName = file.split('.')[0]
// 		console.log(`Event Load : ${eventName}`)
// 		client.on(eventName, event.bind(null, client))
// 	})
// })

// fs.readdir('./commands/', (err, files) => {
// 	if (err) return console.error(err)
// 	files.forEach((file) => {
// 		if (!file.endsWith('.js')) return
// 		let props = require(`./commands/${file}`)
// 		console.log(`Command Load : ${file}`)
// 		props.config.commands.forEach((commandName) => {
// 			client.commands.set(commandName, props)
// 		})
// 	})
// })

// process.on('uncaughtException', (err) => {
// 	console.error(err)
// })

// client.once("ready", () => {
// 	console.log(`${client.}`)
// })
*/

const fs = require('fs')
const Discord = require('discord.js')
const { prefix, token } = require('./config.json')

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

const commandFolders = fs.readdirSync('./commands')
const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'))

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'))
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`)
		client.commands.set(command.name, command)
	}
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client))
	} else {
		client.on(event.name, (...args) => event.execute(...args, client))
	}
}

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
		)

	if (!command) return

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply("I can't execute that command inside DMs!")
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author)
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!')
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${commandName} ${command.usage}\``
		}

		return message.channel.send(reply)
	}

	const { cooldowns } = client

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection())
	}

	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 3) * 1000

	if (timestamps.has(message.author.id)) {
		const expirationTime =
			timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return message.reply(
				`please wait ${timeLeft.toFixed(
					1
				)} more second(s) before reusing the \`${
					command.name
				}\` command.`
			)
		}
	}

	timestamps.set(message.author.id, now)
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

	try {
		command.execute(message, args, client)
	} catch (error) {
		console.error(error)
		message.reply('there was an error trying to execute that command!')
	}
})

client.login(token)
