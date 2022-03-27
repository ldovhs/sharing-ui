import discord, { Intents, User } from "discord.js";

const { DISCORD_BOT_TOKEN } = process.env;

let discordClient;

class DiscordContext {
    constructor() {}

    async getInstance() {
        //discordClient = global.discordClient;
        if (!discordClient) {
            console.log("New Discord Client");
            discordClient = new discord.Client({
                intents: [
                    Intents.FLAGS.GUILDS,
                    Intents.FLAGS.GUILD_MESSAGES,
                    Intents.FLAGS.GUILD_MEMBERS,
                ],
            });
            // make a promise login here, to stall the next return line of code
            return new Promise((resolve, reject) => {
                console.log(1);
                discordClient.login(DISCORD_BOT_TOKEN).then(() => {
                    console.log(2);
                    if (discordClient.isReady()) {
                        // global.discordClient = discordClient;
                        console.log(3);
                        console.log("Discord Ready3!");

                        resolve(discordClient);
                    }
                    discordClient.once("ready", async () => {
                        console.log(4);
                        //global.discordClient = discordClient;

                        if (discordClient.isReady()) {
                            console.log("Discord Ready4!");

                            resolve(discordClient);
                        }
                    });
                });
            });
        }
        console.log("Discord client existed, returning the instance");
        return discordClient;
    }
}

const discordInstance = new DiscordContext();
Object.freeze(discordInstance);
export default discordInstance;
