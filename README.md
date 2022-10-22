

# Description

This is the repo for the Sharing-UI of project Anomura.

Some endpoints which post a message to a discord server, we need a nodejs server to handle discordjs package, currently we cannot have discordjs within this repo due to Vercel only supports Node runtime execution up to v14. Discordjs needs v16.

The nodejs server can be found at: https://github.com/qhuynhvhslab/aedi-bot

## How to use

Execute run dev command to start the site on local server for developing it.
The server uses prisma, so it needs a local postgresql.

```bash
npm run dev
# or
yarn run dev
```

## Env file
```bash

```
