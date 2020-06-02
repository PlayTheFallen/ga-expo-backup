# info-channel-backup

A backup repository for an information channel.

## Configuration

| Key                   | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `!webhook.*`          | `Object`         |             |
| `webhook.id`          | `string`         |             |
| `webhook.token`       | `string`         |             |
| `defaultPayload?=!{}` | `WebhookMessage` |             |
| `!files=[]`           | `string[]`       |             |

-   `!` = required
-   `?` = optional

## License

Rights to the files `config.example.json` and `post.js` are licensed to public domain.

## Run Instructions

- `npm install`
- (create and configure `config.json` file)
- `npm start`

## Run Sequence

### #rules-and-info

*This sequence is not used.*

- `./content/rules-and-info/expo-rules.md`

### #server-naviagtion

**1st Sequence**

- `./content/server-navigation/masters-alumni-embed.json`
- `./content/server-navigation/3rdyear-embed.json`
- `./content/server-navigation/2ndyear-embed.json`
- `./content/server-navigation/1styear-embed.json`

**2nd Sequence**

Run manual data alteration to have `back-to-top.md` target the first message in the channel.

- `./content/server-navigation/back-to-top.md`