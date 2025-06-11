import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
config()

const botID = "1382184202228859002";
const serverID = "752730590658428938";
const TOKEN = process.env.DISCORD_TOKEN;

const rest = new REST().setToken(TOKEN);

const slashRegister = async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                new SlashCommandBuilder()
                    .setName("host")
                    .setDescription("Host new runs")
                    .addStringOption((option) =>
                        option.setName("zone")
                            .setDescription("Which zone?")
                            .setRequired(true)
                            .addChoices(
                                { name: "Tombs", value: "tombs" },
                                { name: "Chaos", value: "chaos" },
                                { name: "Baal", value: "baal" }
                            ))
                    .addStringOption((option) =>
                        option.setName("game")
                            .setDescription("Game Name")
                            .setRequired(true)
                    )
                    .addStringOption((option) =>
                        option.setName("pw")
                            .setDescription("Password")
                            .setRequired(true))
            ]
        })
    }
    catch (error) {
        console.error(error)
    }
};

slashRegister();