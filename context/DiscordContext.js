import discord, { Intents, User } from "discord.js";

const { DISCORD_BOT_TOKEN } = process.env;

var discordClient;

global.discordClient = discordClient;
class DiscordContext {
    constructor() {}

    async getInstance() {
        if (discordClient == null) {
            console.log("Discord client is null, creating new Discord Client");
            discordClient = new discord.Client({
                intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            });
            discordClient.once("ready", () => {
                console.log("Discord Ready!");
            });
            await discordClient.login(DISCORD_BOT_TOKEN);
            return discordClient;
        }
        console.log("Discord client existed, returning the instance");
        return discordClient;
    }
}

const discordInstance = new DiscordContext();
Object.freeze(discordInstance);
export default discordInstance;
