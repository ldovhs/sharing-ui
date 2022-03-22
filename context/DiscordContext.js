import discord, { Intents, User } from "discord.js";

const { DISCORD_BOT_TOKEN } = process.env;

// const discordClient = new discord.Client({
//     intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
// });

// // When the client is ready, run this code (only once)
// discordClient.once("ready", () => {
//     console.log("Discord Ready!");
// });

// // Login to Discord with your client's token
// discordClient.login(DISCORD_BOT_TOKEN);

// export default discordClient;

var client;
class DiscordContext {
    constructor() {}

    async getInstance() {
        if (client == null) {
            console.log("Discord client is null, creating new Discord Client");
            client = new discord.Client({
                intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            });
            client.once("ready", () => {
                console.log("Discord Ready!");
            });
            await client.login(DISCORD_BOT_TOKEN);
            return client;
        }
        return client;
    }
}

const discordInstance = new DiscordContext();
Object.freeze(discordInstance);
export default discordInstance;
