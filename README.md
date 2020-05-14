# discord-channel-backup

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
