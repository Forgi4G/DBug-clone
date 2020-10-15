const Report = require("../../handlers/report");
const Log = require("../../handlers/logging");
const LocalFramework = require("../../utils/local-framework");

module.exports = {
	name: "submit",
	category: "report",
	description: "Reports a bug",
	roles: [],
	run: async (client, message, args) => {
		const { channels: { androidBugs, desktopBugs, marketingBugs, iosBugs } } = require("../../config");
		const localFramework = new LocalFramework({ listener: message });
		if (message.deletable) localFramework.deleteMSG(message);
		let current = 0;

		if (![androidBugs, desktopBugs, marketingBugs, iosBugs].includes(message.channel.id)) return localFramework.sendTempReply("This command can only be used in a bug report channel.");

		let title = "", steps = "", actual = "", expected = "", clientSettings = "", systemSettings = "";

		for (let i = 0; i < args.length; i++) {
			switch (args[i]) {
				case "-t":
					current = 1;
					i++;
					break;
				case "-r":
					current = 2;
					i++;
					break;
				case "-e":
					current = 3;
					i++;
					break;
				case "-a":
					current = 4;
					i++;
					break;
				case "-c":
					current = 5;
					i++;
					break;
				case "-s":
					current = 6;
					i++;
					break;
				default:
					break;
			}
			if (current === 1) title += `${args[i]} `;
			else if (current === 2) steps += `${args[i]} `;
			else if (current === 3) actual += `${args[i]} `;
			else if (current === 4) expected += `${args[i]} `;
			else if (current === 5) clientSettings += `${args[i]} `;
			else if (current === 6) systemSettings += `${args[i]} `;
		}

		if ([!title, !steps, !actual, !expected, !clientSettings, !systemSettings].includes(true))
			return localFramework.sendTempReply("You must provide a title, steps to reproduce, actual result, expected result, client settings, and system settings. For assistance formatting your report, use <https://testersqts.github.io/bug-report-tool/>");

		steps = steps.split("-");

		await Report.Send(
			client,
			message,
			title,
			steps,
			actual,
			expected,
			clientSettings,
			systemSettings
		);

		Log.Send(
			client,
			`💡 New bug report with the title \`\`${title}\`\` submitted by **${message.author.username}**#${message.author.discriminator} (${message.author.id})`
		);

		return localFramework.sendTempMSG(":tada:", 3000);
	},
};
