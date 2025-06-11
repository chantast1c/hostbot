import { BaseInteraction, Client, EmbedBuilder } from "discord.js";
import { config } from "dotenv";

config();
const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
});
const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN).catch((e) => console.error(e));
client.on("ready", () => {
    console.log("The bot is logged in.");
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "host") {
            let zone = interaction.options.getString("zone")
            switch (zone) {
                case "tombs":
                    try {
                        await interaction.reply('<@' + interaction.user.id + ">" + " is hosting Tombs!")
                    }
                    catch (e) {
                        console.log(e)
                    }
                case "chaos":
                    try {
                        await interaction.reply('<@' + interaction.user.id + ">" + " is hosting Chaos!")
                    }
                    catch (e) {
                        console.log(e)
                    }
                case "baal":
                    try {
                        await interaction.reply('<@' + interaction.user.id + ">" + " is hosting Pre-Tele Baal!")
                    }
                    catch (e) {
                        console.log(e)
                    }
            }
        }
    }
}
)