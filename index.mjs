import fs from "fs"
import { Client, Collection, Intents } from "discord.js";
import env from "./config.json";
import * as util from './util.mjs';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.username}#${client.user.discriminator}`);
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "firstreaction") {
        const emojiList = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚪️"];
        const reactionNum = interaction.options.get("reactions");
        if (reactionNum >= emojiList.length)
          return interaction.reply({
            content:
              "Can't complete request -- your reaction count is larger than the amount of available emojis.",
            ephemeral: true,
          });

        const message = await interaction.reply({
          content: "Test message for reacting",
          fetchReply: true,
        });

        const emoti = util.getRandom(emojiList, reactionNum.value);
        const selectedReaction = util.getRandom(emoti, emoti.length - 1);
        for (let r = 0; r < emoti.length; r++) {
            message.react(emoti[r]);
        }
    }
});

client.login(env.token);
