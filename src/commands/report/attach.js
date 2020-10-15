const Report = require("../../models/report");
const ReportHandler = require("../../handlers/report");
const Log = require("../../handlers/logging");
const clc = require("cli-color");
const LocalFramework = require('../../utils/local-framework');

module.exports = {
	name: "attach",
	category: "report",
	description: "Attach a file to a report",
	roles: [],
	run: async (client, message, args) => {
		let msgFrame = new LocalFramework({ listener: message });
		if (message.deletable) msgFrame.deleteMSG(message);
		if (!args[0])
			return msgFrame.sendTempReply("You forgot the report ID.");
		else if (!args[1])
			return msgFrame.sendTempReply("You forgot an URL for the attachment.");
		else if (!args[2])
			return msgFrame.sendTempReply("You forgot a name for the attachment.");

		const id = args[0], url = args[1], name = args.slice(2).join(" ");

		const r = async function (params) {
			try {
				return await Report.findOne(params);
			} catch (err) {
				console.error(clc.red(err));
			}
		};

		const foundReport = await r({ reportID: id });
		if (!foundReport)
			return msgFrame.sendTempReply("That report doesnt exist :(");
		else if (foundReport.stance === "Denied")
			return msgFrame.sendTempReply("This bug has already been denied.");

		await Report.updateOne(
			{ _id: foundReport._id },
			{
				$push: {
					attachmentUrl: url,
					attachmentName: name,
				},
			}
		);

		await ReportHandler.UpdateStance(client, await r({reportID: id}));

		Log.Send(
			client,
			`📎 Bug \`\`#${foundReport.reportID}\`\` submitted by ${foundReport.userTag} (${foundReport.userID}) **got a new attachment** attached by **${message.author.username}**#${message.author.discriminator} (${message.author.id})\n**URL:** ${url}\n**Name:** ${name}`
		);

		return msgFrame.sendTempMSG(`The eagle has landed!`);
	},
};
