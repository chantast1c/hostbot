import { ActionRowBuilder, Client, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
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
let messagemap = new Map()

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "host") {
            const timestamp = Date.now()
            let zone = interaction.options.getString("zone")
            let run = {
                time: timestamp,
                id: runid,
                host: interaction.user.id,
                runners: [interaction.user.id],
            }
            switch (zone) {
                case "tombs":
                    try {
                        const join = new ButtonBuilder()
                            .setCustomId(`join_` + `${runid}`)
                            .setLabel('Join')
                            .setStyle(ButtonStyle.Success);
                        const leave = new ButtonBuilder()
                            .setCustomId(`leave_` + `${runid}`)
                            .setLabel("Leave")
                            .setStyle(ButtonStyle.Danger);
                        const row = new ActionRowBuilder()
                            .addComponents(join, leave);
                        const response = await interaction.reply({
                            content: '<@' + interaction.user.id + ">" + " is hosting Tombs! " + `[${run.runners.length}/8]`,
                            components: [row],
                            withResponse: true
                        })
                        run.message = response;
                        messagemap.set(runid, run)
                        runid++
                        break
                    }
                    catch (e) {
                        console.log(e)
                    }
                case "chaos":
                    try {
                        const join = new ButtonBuilder()
                            .setCustomId(`join_` + `${runid}`)
                            .setLabel('Join')
                            .setStyle(ButtonStyle.Success);
                        const leave = new ButtonBuilder()
                            .setCustomId(`leave_` + `${runid}`)
                            .setLabel("Leave")
                            .setStyle(ButtonStyle.Danger);
                        const row = new ActionRowBuilder()
                            .addComponents(join, leave);
                        const response = await interaction.reply({
                            content: '<@' + interaction.user.id + ">" + " is hosting Chaos! " + `[${run.runners.length}/8]`,
                            components: [row],
                            withResponse: true
                        })
                        run.message = response;
                        messagemap.set(runid, run)
                        runid++
                        break
                    }
                    catch (e) {
                        console.log(e)
                    }
                case "baal":
                    try {
                        const join = new ButtonBuilder()
                            .setCustomId(`join_` + `${runid}`)
                            .setLabel('Join')
                            .setStyle(ButtonStyle.Success);
                        const leave = new ButtonBuilder()
                            .setCustomId(`leave_` + `${runid}`)
                            .setLabel("Leave")
                            .setStyle(ButtonStyle.Danger);
                        const row = new ActionRowBuilder()
                            .addComponents(join, leave)
                        const response = await interaction.reply({
                            content: '<@' + interaction.user.id + ">" + " is hosting Pre-Tele Baal! " + `[${run.runners.length}/8]`,
                            components: [row],
                            withResponse: true
                        }
                        )
                        run.message = response
                        messagemap.set(runid, run)
                        runid++
                        break
                    }
                    catch (e) {
                        console.log(e)
                    }
            }
        }
    }
    // Button handler
    if (interaction.isButton()) {
        const [action, idStr] = interaction.customId.split("_");
        const id = parseInt(idStr);
        const message = messagemap.get(id);

        if (!message) {
            await interaction.reply({ content: "Could not find run info.", flags: MessageFlags.Ephemeral });
            return;
        }

        // Handle join and leave separately
        if (action === "join") {
            // Logic to add the user to the run
            if (!messagemap.get(id).runners.includes(interaction.user.id)) {
                messagemap.get(id).runners.push(interaction.user.id)
                await interaction.reply({ content: `You joined run ${id}`, flags: MessageFlags.Ephemeral });
                await messagemap.get(id).message.resource.content
            }
            else {
                await interaction.reply({ content: "You are already in the run.", flags: MessageFlags.Ephemeral })
            }
            // Optionally: update the message with new runner count
        } else if (action === "leave") {
            // Logic to remove the user from the run
            if (messagemap.get(id).runners.includes(interaction.user.id)) {
                let run = messagemap.get(id);
                run.runners = messagemap.get(id).runners.filter(item => item !== interaction.user.id)
                messagemap.set(id, run)
                await interaction.reply({ content: `You left run ${id}`, flags: MessageFlags.Ephemeral });
            }
            else {
                await interaction.reply({ content: "You are not in the run.", flags: MessageFlags.Ephemeral })
            }
            // Optionally: update the message
        }
    }
}
)
