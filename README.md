

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

DATABASE_URL=postgres://username:password@localhost:5432/databasename
NEXT_PUBLIC_WEBSITE_HOST = "http://localhost:3000"
NEXT_PUBLIC_NEXTAUTH_SECRET=  "the secret to be used for NextAuth"
NEXT_PUBLIC_INFURA_ID = the infura id instance, need this for wallet connect authentication
NEXTAUTH_URL= "http://localhost:3000/api/auth"

DISCORD_NODEJS=http://localhost:3005
NODEJS_SECRET= "the secret to be used with NodeJs, on NodeJs server above, we need the same credentials"
DISCORD_BOT_CHANNEL = Any discord channel Id that you want to post message to
NEXT_PUBLIC_DISCORD_CLIENT_ID = client Id from Discord Developer Portal for an app
DISCORD_CLIENT_SECRET =  client secret from Discord Developer Portal for an app

NEXT_PUBLIC_TWITTER_CLIENT_ID = client Id from Twitter Developer Portal for an app
TWITTER_CLIENT_SECRET = client secret from Twitter Developer Portal for an app
```
