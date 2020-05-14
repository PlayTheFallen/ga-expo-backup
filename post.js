/* eslint-disable indent */
const { promises: fs } = require('fs');
const path = require('path');

const {
	WebhookClient,
	Util: { mergeDefault },
} = require('discord.js');

const config = require('./config.json');

const webhook = new WebhookClient(config.webhook.id, config.webhook.token);

/**
 *
 * @param {number} [time=1000]
 * @returns {Promise<void>}
 */
const sleep = (time = 1000) => new Promise((resolve) => setTimeout(() => resolve()), time);

const sendPayload = async (payload) => webhook.send(mergeDefault(config.defaultPayload, payload));

/**
 *
 * @param {string} filePath
 * @returns {Promise<[Buffer, path.ParsedPath]>}
 */
async function getFile(filePath) {
	filePath = path.resolve(filePath);
	const fileInfo = path.parse(filePath);
	const fileContent = await fs.readFile(filePath);

	return [fileContent, fileInfo];
}

const run = async () => {
	for (let index = 0; index < config.files.length; index++) {
		const [content, info] = await getFile(config.files[index]);

		let payload;
		switch (info.ext) {
			case '.png': {
				payload = {
					files: [{
						attachment: content,
						name: `${info.name}.${info.ext}`,
					}],
				};
				break;
			}
			case '.txt':
			case '.md': {
				// sendPayload({ embeds: [{ description: content.toString("utf8") }] });
				payload = { content: content.toString('utf8') };
				break;
			}
			case '.json': {
				payload = JSON.parse(content.toString('utf8'));
				break;
			}
			default: {
				continue;
			}
		}

		await sendPayload(payload);

		console.log(`[${index}] Sent content for ${info.name}${info.ext}`);

		await sleep(2000);
	}
	const stamp = new Date();
	if (config.updatedEmbed) {
		await sendPayload(mergeDefault({
			embeds: [
				{
					description: `This channel was last updated ${stamp.toUTCString()} (${stamp.toISOString()})`,
					color: 15088455,
				},
			],
		}, config.updatedEmbed));
	}
};

run().then(() => {
	console.log('Script run complete');
	process.exit(0);
});
