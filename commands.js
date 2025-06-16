import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
config()

const botID = "1382184202228859002";
const serverID = "981373680787537943";
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
                            )),
                new SlashCommandBuilder()
                    .setName("runs")
                    .setDescription("Find game info"),
                new SlashCommandBuilder()
                    .setName("end")
                    .setDescription("End run")
                    .addStringOption((option) =>
                        option.setName("zone")
                            .setDescription("which zone?")
                            .setRequired(true)
                            .addChoices(
                                { name: "All", value: "all" },
                                { name: "Tombs", value: "tombs" },
                                { name: "Chaos", value: "chaos" },
                                { name: "Baal", value: "baal" }
                            ))
            ]
        })
    }
    catch (error) {
        console.error(error)
    }
};

slashRegister();