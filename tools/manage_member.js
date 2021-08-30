const raid_schema = require('../schema/raid')

module.exports = {
	add_member: async (guildId, raidId, memberId) => {
		try {
			let raid_data = await raid_schema.findOne({ guildId, raidId })

			if (!raid_data) throw 'notExist'
			if (raid_data.member.length === raid_data.type) throw 'fullMember'
			if (raid_data.member.includes(memberId)) throw 'existMember'

			await raid_data.member.push(memberId)
			await raid_data.save()

			return raid_data
		} catch (err) {
			throw err
		}
	},
	remove_member: async (guildId, raidId, memberId) => {
		try {
			let raid_data = await raid_schema.findOne({ guildId, raidId })

			if (!raid_data) throw 'notExist'
			if (memberId === raid_data.leader) throw 'raidLeader'
			if (!raid_data.member.includes(memberId)) throw 'notMember'

			await raid_data.member.splice(raid_data.member.indexOf(memberId), 1)
			await raid_data.save()

			return raid_data
		} catch (err) {
			throw err
		}
	},
}
