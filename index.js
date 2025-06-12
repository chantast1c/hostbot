import { ActionRowBuilder, Client, ButtonBuilder, ButtonStyle } from "discord.js";
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

//initialize run 0
let runid = 0
let runs = {};

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "host") {
            let zone = interaction.options.getString("zone")
            let run = {
                host: interaction.user.id,
                runners: [interaction.user.id],
            }
            switch (zone) {
                case "tombs":
                    try {
                        const join = new ButtonBuilder()
                            .setCustomId(`join` + `${runid}`)
                            .setLabel('Join')
                            .setStyle(ButtonStyle.Success);
                        const leave = new ButtonBuilder()
                            .setCustomID(`leave` + `${runid}`)
                            .setLabel("Leave")
                            .setStyle(ButtonStyle.Danger);
                        const row = new ActionRowBuilder()
                            .addComponents(join, leave);
                        await interaction.reply({
                            content: '<@' + interaction.user.id + ">" + " is hosting Tombs! " + `[${run.runners.length}/8]`,
                            components: [row],
                        })
                        runid++
                    }
                    catch (e) {
                        console.log(e)
                    }
                case "chaos":
                    try {
                        const join = new ButtonBuilder()
                            .setCustomId(`join` + `${runid}`)
                            .setLabel('Join')
                            .setStyle(ButtonStyle.Success);
                        const leave = new ButtonBuilder()
                            .setCustomID(`leave` + `${runid}`)
                            .setLabel("Leave")
                            .setStyle(ButtonStyle.Danger);
                        const row = new ActionRowBuilder()
                            .addComponents(join, leave);
                        await interaction.reply({
                            content: '<@' + interaction.user.id + ">" + " is hosting Chaos! " + `[${run.runners.length}/8]`,
                            components: [row],
                        })
                        runid++
                    }
                    catch (e) {
                        console.log(e)
                    }
                case "baal":
                    try {
                        const join = new ButtonBuilder()
                            .setCustomId(`join` + `${runid}`)
                            .setLabel('Join')
                            .setStyle(ButtonStyle.Success);
                        const leave = new ButtonBuilder()
                            .setCustomId(`leave` + `${runid}`)
                            .setLabel("Leave")
                            .setStyle(ButtonStyle.Danger);
                        const row = new ActionRowBuilder()
                            .addComponents(join, leave)
                        await interaction.reply({
                            content: '<@' + interaction.user.id + ">" + " is hosting Pre-Tele Baal! " + `[${run.runners.length}/8]`,
                            components: [row],
                        }
                        )
                        runid++
                    }
                    catch (e) {
                        console.log(e)
                    }
            }
        }
    }
}
)