const Discord = require('discord.js')
const { prefix } = require('../../config.json')
const config = require('../../config.json')

module.exports = {
	name: '명령어',
	description: '사용법을 알려드림!',
	aliases: ['도움말', 'help'],
	usage: '[command name]',
	cooldown: 5,
	execute: (message, args, client) => {
		let data = []

		if (!args.length) {
			data.push('**우뇽봇이 알고있는 명령어!**')
			data.push('┃')
			data.push('┣━** :one: 레이드 관련 명령어 목록 보기 **')
			data.push('┃	 ┗ !(명령어, 도움말, help) 레이드')
			data.push('┃')
			data.push('┣━** :two: 캐릭터 정보 보기 **')
			data.push('┃	 ┗ !(정보, info) [캐릭터명] <기본, 아이템, 스킬>')
			data.push('┃')
			data.push('┗━** :tools: 관리자용 명령어 목록 보기 **')
			data.push('		 ┗ !(명령어, 도움말, help) 관리자')
			data.push(' ')
			data.push('*() - 선택, [] - 필수, <> - 생략가능*')

			return message.channel.send(data)
		}

		const name = args[0].toLowerCase()

		if (name === '레이드' || name === 'raid') {
			data.push('**레이드 관련 명령어**')
			data.push('┃')
			data.push('┣━** 1️⃣ 레이드 생성 **')
			data.push(
				'┃	 ┗ ![보스명] [난이도] **{일정(MM월 DD일 오전(오후) HH시 mm분)}**'
			)
			data.push('┃	 ┗ ex) !발탄 노말 8월 20일 오후 6시 00분')
			data.push('┃	 ┗ ** ‼️ 레이드 생성시 주의 사항 ‼️ **')
			data.push('┃	 	┗ ** 난이도만 입력한 경우 ** - 오늘 오후 8시로 고정')
			data.push('┃		 ┗ ** 월 정보만 입력한 경우 ** - 오늘 오후 8시로 고정')
			data.push(
				'┃		 ┗ ** 월,일 정보만 입력한 경우 ** - 해당 월,일 오후 8시로 고정'
			)
			data.push(
				'┃		 ┗ ** 시간 정보만 입력한 경우 ** - 오늘 해당 시간으로 고정'
			)
			data.push(
				'┃		 ┗ ** 시간의 경우 24시 표기법 가능 ** - 오후 10시 = 22시'
			)
			data.push(
				'┃		 ┗ ** 모든 일정은 현재 시간보다 이전으로 설정 할 수 없음. **'
			)
			data.push('┃')
			data.push('┣━** 2️⃣ 레이드 참여 **')
			data.push('┃	 ┗ !참여 [레이드 ID]')
			data.push('┃')
			data.push('┣━** 3️⃣ 레이드 나가기 **')
			data.push('┃	 ┗ !나가기 [레이드 ID]')
			data.push('┃')
			data.push('┣━** 4️⃣ 레이드 목록 **')
			data.push('┃	 ┗ !목록 **{보스명}**')
			data.push('┃')
			data.push('┗━** 대괄호 [] 는 필수, 중괄호 {} 는 생략 가능 **')

			return message.channel.send(data)
		}

		if (name === '관리자' || name === 'admin') {
			const authorPerms = message.channel.permissionsFor(message.author)
			if (!authorPerms || !authorPerms.has('ADMINISTRATOR')) {
				return message.reply('넌! 사용못한다!! 안돼. 안바꿔줘')
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
