import {
  ActionRowBuilder,
  Client,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
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

let runid = 0; //Initialize runid
let runmap = new Map(); //Stores a map of all active runs
const MAX_PLAYER_COUNT = 8; //Max players per game
const MAX_RUN_LENGTH = 2 * 60 * 60 * 1000; //Max active run duration

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "host") {
      //Reset previous runs if older than 2 hours
      if (runmap.size >= 1) {
        const current = new Date();
        for (const [id, run] of runmap.entries()) {
          if (current - run.time > MAX_RUN_LENGTH) runmap.delete(id);
        }
      }
      const timestamp = Date.now();
      let zone = interaction.options.getString("zone");
      let run = {
        time: timestamp,
        id: runid,
        host: interaction.user.id,
        runners: [interaction.user.id],
      };
      //Send game info via modal
      const modal = new ModalBuilder()
        .setCustomId(`modal_${runid}_${zone}`)
        .setTitle("Game Info");
      const game = new TextInputBuilder()
        .setCustomId(`gameinfo_${runid}`)
        .setLabel("Game Name")
        .setStyle(TextInputStyle.Short);
      const pw = new TextInputBuilder()
        .setCustomId(`password_${runid}`)
        .setLabel("Password")
        .setStyle(TextInputStyle.Short);
      const firstrow = new ActionRowBuilder().addComponents(game);
      const secondrow = new ActionRowBuilder().addComponents(pw);
      modal.addComponents(firstrow, secondrow);
      runmap.set(runid, run);
      await interaction.showModal(modal);
    }

    if (interaction.commandName == "runs") {
      if (runmap.size === 0) {
        interaction.reply({
          content: `No active runs.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      let output = "";
      //Parse runmap for runs that user is participating in
      //Pass output string to bot for reply
      for (let [_, run] of runmap) {
        if (run.runners.includes(interaction.user.id)) {
          const host = `<@${run.host}>`;
          const tz = run.zone;
          const gameName = run.game;
          const pw = run.pw;
          const mentions = run.runners.map((id) => `<@${id}>`).join("\n");
          output += `Host: ${host}\nTZ: ${tz}\nGame name: ${gameName} \nPassword: ${pw} \nPlayers: \n${mentions}\n\n`;
        }
      }
      if (output.length > 0) {
        await interaction.reply({
          content: output,
          flags: MessageFlags.Ephemeral,
        });
        return;
      } else {
        interaction.reply({
          content: "You are not in any active runs.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    if (interaction.commandName == "end") {
      let isHosting = false;
      for (const [_, run] of runmap) {
        if (run.host == interaction.user.id) {
          isHosting = true;
        }
      }
      if (!isHosting) {
        await interaction.reply({
          content: "You are not hosting any runs.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      const zone = interaction.options.getString("zone");
      let ended = false;
      switch (zone) {
        case "all":
          for (const [id, run] of runmap) {
            if (run.host == interaction.user.id) {
              runmap.delete(id);
              ended = true;
            }
          }
          if (ended) {
            await interaction.reply({
              content: `<@${interaction.user.id}> has ended all runs.`,
            });
            return;
          } else {
            await interaction.reply({
              content: "You are not hosting any runs.",
              flags: MessageFlags.Ephemeral,
            });
            return;
          }
        case "tombs":
        case "chaos":
        case "baal":
          for (const [id, run] of runmap) {
            if (run.host == interaction.user.id && run.zone == zone) {
              runmap.delete(id);
              ended = true;
            }
          }
          if (ended) {
            await interaction.reply({
              content: `<@${interaction.user.id}> has ended ${zone} runs`,
            });
            return;
          } else {
            await interaction.reply({
              content: `You are not hosting ${zone} runs.`,
              flags: MessageFlags.Ephemeral,
            });
            return;
          }
      }
    }
  }

  // Button handler
  if (interaction.isButton()) {
    const [action, idStr] = interaction.customId.split("_");
    const id = parseInt(idStr);
    let run = runmap.get(id);
    //Check if run no longer exists
    if (!runmap.get(id)) {
      await interaction.reply({
        content: "The run has ended.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Handle join and leave separately
    if (action === "join") {
      // Logic to add the user to the run
      if (!run.runners.includes(interaction.user.id)) {
        if (run.runners.length == MAX_PLAYER_COUNT) {
          await interaction.reply({
            content: "Run is full.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
        run.runners.push(interaction.user.id);
        await interaction.reply(
          `<@${interaction.user.id}> has joined the run! [${run.runners.length}/8]`
        );
        await interaction.followUp({
          content: `You joined <@${run.host}> 's ${run.zone} run! \n Game info: ${run.game} \n Password: ${run.pw}`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "You are already in the run.",
          flags: MessageFlags.Ephemeral,
        });
      }
      // Optionally: update the message with new runner count
    } else if (action === "leave") {
      // Logic to remove the user from the run
      if (runmap.get(id).runners.includes(interaction.user.id)) {
        run.runners = runmap
          .get(id)
          .runners.filter((item) => item !== interaction.user.id);
        runmap.set(id, run);
        await interaction.reply({
          content: `You left <@${runmap.get(id).host}>'s ${runmap.get(id).zone} runs.`,
          flags: MessageFlags.Ephemeral,
        });
        await interaction.followUp(
          `<@${interaction.user.id}> has left the run! [${runmap.get(id).runners.length}/8]`
        );
      } else {
        await interaction.reply({
          content: "You are not in the run.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }

  if (interaction.isModalSubmit()) {
    const [_, idStr, zone] = interaction.customId.split("_");
    const id = parseInt(idStr);
    let run = runmap.get(id);
    let zoneName =
      {
        tombs: "Tombs",
        chaos: "Chaos",
        baal: "Pre-Tele Baal",
      }[zone] || "Unknown Zone";
    run.game = interaction.fields.getTextInputValue(`gameinfo_${id}`);
    run.pw = interaction.fields.getTextInputValue(`password_${id}`);
    try {
      const join = new ButtonBuilder()
        .setCustomId(`join_${id}`)
        .setLabel("Join")
        .setStyle(ButtonStyle.Success);
      const leave = new ButtonBuilder()
        .setCustomId(`leave_${id}`)
        .setLabel("Leave")
        .setStyle(ButtonStyle.Danger);
      const row = new ActionRowBuilder().addComponents(join, leave);
      const response = await interaction.reply({
        content: `<@${interaction.user.id}> is hosting ${zoneName}! [${run.runners.length}/8]`,
        components: [row],
        withResponse: true,
      });
      run.message = response;
      run.zone = zone;
      runmap.set(id, run);
      await interaction.followUp({
        content: `Thank you for hosting ${zoneName}! \nGame name: ${run.game} \nPassword: ${run.pw}`,
        flags: MessageFlags.Ephemeral,
      });
      runid++;
    } catch (e) {
      console.log(e);
    }
  }
});
