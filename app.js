require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

client.once('ready', () => {
	console.log('우뇽이 준비됐다뇽!')
})

client.login(process.env.DISCORD_TOKEN)
