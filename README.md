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

* `!` = required
* `?` = optional

## License

Rights to the files `config.example.json` and `post.js` are licensed to public domain.

## Run Instructions

* `npm install` 
* (create and configure `config.json` file)
* `npm start` 

## Run Sequence

### #rules-and-info

``` json
[
  {
    "type": "file",
    "path": "./content/rules-and-info/server-welcome.md"
  },
  {
    "type": "file",
    "path": "./content/rules-and-info/server-rules.md"
  },
  {
    "type": "file",
    "path": "./content/rules-and-info/useful-commands.md"
  },
  {
    "type": "file",
    "path": "./content/rules-and-info/schedule/industry-guests.md"
  },
  {
    "type": "file",
    "path": "./content/rules-and-info/schedule/discord-schedule.md"
  },
  {
    "type": "file",
    "path": "./content/rules-and-info/final-note.md"
  },
  {
    "type": "file",
    "path": "./content/server-navigation/back-to-top.njk"
  }
]
``` 

### #server-naviagtion

```json
[
  {
    "type": "glob",
    "glob": "./content/server-navigation/*year-embed.yml",
    "reverse": true
  },
  {
    "type": "file",
    "path": "./content/server-navigation/personal-projects-embed.yml"
  },
  {
    "type": "file",
    "path": "./content/server-navigation/back-to-top.njk"
  }
]
```

### #team-info

Block channel from view of other users.

```json
[
  {
    "type": "file",
    "path": "./content/team-info/ask-moderator.md"
  },
  {
    "type": "file",
    "path": "./content/team-info/ask-admin.md"
  },
  {
    "type": "file",
    "path": "./content/team-info/tools.md"
  },
  {
    "type": "file",
    "path": "./content/team-info/final-message.md"
  },
  {
    "type": "file",
    "path": "./content/server-navigation/back-to-top.njk"
  }
]
```

## Dev Notes / Ideas for `channel-backup`

*These will be added to the [main project board](https://github.com/orgs/TinkerStorm/projects/4).*

- Native glob recognition - rather than having to rely on a file's **declared** type, it would be *theortically* better to use native detectiom methods to determine what should be done.

- Importing configs from other files?
  Importing configs / files from the interweb?

- Native limit validation
- Custom user-agent / custom library
- Generic config schema

---

*The following notes were made during the archiving of 3:1 where dividers were used in groups of 4... mostly.*

- Group sequence divider - most teams have used dividers as part of their content
  > instead of having to provide a file path after each content file, the sequence poster could run a sequence to insert another file in each file path entry (consider use of hooks, `pre_*` - *implying it has access to the file sequence before it is sent* or `post_send` - *implying this hook will be run directly after a message is sent successfully*)

```json
// channel-backup-plugin-divider
["divider", {
  "file": "./path/to/fileOrImage.md"
}]
// using a glob here is not advised or recommended
```

- Group chunking - *to work in conjunction with the divider plugin* chunk the file sequence by {n} files (provided that a glob hasn't already been used within {n} files)
  > Order of plugins would begin to matter when deciding which plugins run first (if the run sequence isn't modified by the base program)

```json
[
  ["group-chunks", {
    "chunk_after": 4
  }],
  ["divider", {
    "file": "./path/to/file.png"
  }]
]
```

- Native group type / group nesting - *would conflict slightly with group-chunks, but intended to work like globs with files in multiple destinations*
  > These nested groups could contain globs themselves, but that would *arguably* make it much harder to decide how a sequence should be processed.

  If it wasn't native, a `group` type could be added and process it *like a glob* where it spreads the argument.

```json
// v2
{
  "files": [
    { "type": "file", "path": "/path/to/content.md" },
    { "type": "glob", "glob": "./path/to/images/*.png" },
    {
      "type": "group",
      "files": [
        "./path/to/notice.md",
        "./path/to/help-info.md"
      ]
    }
  ]
}


// v3
{
  "files": [
    "/path/to/content.md",
    "./path/to/images/*.png",
    [
      "./path/to/notice.md",
      "./path/to/help-info.md"
    ] // idk, just brainstorming at this point
  ]
}