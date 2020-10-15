const LocalFramework = require('../../utils/local-framework');

module.exports = {
	name: "ping",
	category: "botinfo",
	description: "Returns bot and API latency in milliseconds.",
	roles: ["763860080772775976", "763860111176237057"],
	run: async (client, message, _args) => {
		const localFramework = new LocalFramework({ listener: message });
		return localFramework.sendMSG(
			`🏓 Pong!\n**API:** ${client.ws.ping} ms : **Latency:** ${Math.floor(
				message.createdTimestamp - new Date().getTime()
			)}`
		);
	},
};
