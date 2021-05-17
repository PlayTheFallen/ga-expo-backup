/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const fs = require('fs/promises');
const path = require('path');

const {
	WebhookClient,
	MessageEmbed,
	Util: { mergeDefault, resolveColor },
} = require('discord.js');
const { GlobSync } = require('glob');
const yaml = require('js-yaml');

const config = require('./config.json');

if (typeof config.webhook === 'string') {
	const [id, token] = config.webhook.split('/').slice(-2);

	config.webhook = { id, token };
}

const webhook = new WebhookClient(config.webhook.id, config.webhook.token, {
	disableMentions: 'none',
});

/**
 * @param {number} [time=1000]
 * @returns {Promise<void>}
 */
const sleep = (time = 1000) => new Promise((resolve) => {
	setTimeout(() => resolve());
}, time);

const sendPayload = (payload) => webhook.send(mergeDefault(config.defaultPayload, payload));

const log = (prefix, message) => console.log(`[${prefix.toUpperCase()}] ${message}`);

/**
 * @param {string} filePath
 * @returns {Promise<[Buffer, path.ParsedPath]>}
 */
async function getFile(filePath) {
	log('query', JSON.stringify(filePath));
	filePath = path.resolve(filePath);
	const fileInfo = path.parse(filePath);
	const fileContent = await fs.readFile(filePath);

	return [fileContent, fileInfo];
}

const run = async () => {
	log('init', 'Begin process');
	const files = [];
	const messages = [];

	for await (const file of config.files) {
		log('resolve', `${file.type} (${file.glob || file.path})`);

		switch (file.type) {
			case 'glob':
				files.push(...new GlobSync(file.glob).found);
				break;
			case 'foreign': // ?? must return an absolute path to a file
				break; // TODO: network request?
			case 'file':
			default:
				files.push(file.path);
				break;
		}
	}

	let index = 0;
	for await (const filePath of files) {
		const [content, info] = await getFile(filePath);

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

			case '.yml':
			case '.yaml': {
				payload = yaml.load(content.toString('utf8'));
				break;
			}

			case '.njk':
			default: {
				log('warn', 'Skipping file');
				continue;
			}
		}

		if (config.authors && config.authors[payload.username]) {
			payload.avatarURL = config.authors[payload.username];
		}

		if (payload.embeds) {
			for (const embedIndex in payload.embeds) {
				const embed = new MessageEmbed(payload.embeds[embedIndex]);

				// color is auto resolved
				if (embed.author && !embed.author.iconURL) {
					embed.setAuthor(
						payload.embeds[embedIndex].author.name,
						config.authors[embed.author.name],
					);
				}

				payload.embeds[embedIndex] = embed;
			}
		}

		messages.push(await sendPayload(payload));

		log(`sent/${index}`, `Sent content for ${files[index]}`);

		await sleep(2000);
		index++;
	}

	const stamp = new Date();
	if (config.updatePayload && typeof config.updatePayload === 'object') {
		const updatePayload = mergeDefault({
			embeds: [
				{
					description: 'This channel has been backed up using [TinkerStorm/discord-channel-backup](https://github.com/TinkerStorm/discord-channel-backup).',
					color: resolveColor('#7289DA'),
					timestamp: stamp,
				},
			],
		}, config.updatePayload);

		if (!updatePayload.avatarURL && updatePayload.username) {
			updatePayload.avatarURL = config.authors[updatePayload.username];
		}

		await sendPayload(updatePayload);
		log('*', 'Sent content for update embed.');
	}
};

run().then(() => {
	log('complete', 'Script run complete');
	process.exit();
});
