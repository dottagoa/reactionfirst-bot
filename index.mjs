import fs from 'fs';
import ms from 'ms';
import { Client, Collection, Intents, MessageEmbed } from 'discord.js';
import * as util from './util.mjs';

import dotenv from 'dotenv';
dotenv.config();
const { TOKEN } = process.env;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'firstreaction') {
        // -- INITIAL CHECKS -- //
        if (inProgress) return interaction.reply({ content: "Can't complete request -- previous command in progress.", ephemeral: true });
        inProgress = true;

        // -- USER VARIABLES -- //
        const time = 10000; // time for reactions to be collected before timing out
        const emojiList = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣']; // emojis to use for reactions

        // -- ARGUMENTS -- //
        const reactionNum = interaction.options.get('reactions').value; // argument: reaction count
        const firstUsers = interaction.options.get('usercount').value; // argument: first X users to show

        // -- VARIABLE CHECKS -- //
        if (reactionNum === 0) {
            inProgress = false;
            return interaction.reply({ content: 'I need to be able to react with at least one emoji!', ephemeral: true });
        }
        if (firstUsers === 0) {
            inProgress = false;
            return interaction.reply({ content: 'You must specify at least one user that has to react!', ephemeral: true });
        }

        // -- APPLICATION CONSTANTS -- //
        const emoti = util.getRandom(emojiList, reactionNum); // get random emojis from the list above
        const specialEmoji = util.getRandom(emoti, 1); // choose single emoji for first reactors
        const coolUsers = [];
        const terribleUsers = [];
        const reactTimes = [];

        // -- EMBEDS -- //
        let embed1 = {
            title: 'Reaction test! (preprocessing)',
            description: "**PLEASE WAIT!** I'm adding the reactions, then I'll show you the emoji to choose!",
        };
        // prettier-ignore
        let embed2 = {
            title: 'Reaction test! (in progress)',
            description: `Click the ${specialEmoji} reaction as fast as you can. The first **${firstUsers == 1 ? `person` : `${firstUsers} people`}** to react will be seen below.`,
        };
        // prettier-ignore
        let embed3 = {
            title: 'Reaction test! (complete)',
            description: `Here's **${firstUsers == 1 ? `the first person` : `a list of the ${firstUsers} people`}** who reacted before anyone else${firstUsers != 1 ? ', in the order of how fast they responded' : ''}:`,
            fields: [],
        };

        // -- INITIAL MESSAGE -- //
        if (reactionNum >= emojiList.length)
            return interaction.reply({
                content: 'Your reaction count is larger than the amount of available emojis!',
                ephemeral: true,
            });

        const filter = (reaction, user) => {
            return reaction.emoji.name === specialEmoji.toString();
        };

        const message = await interaction
            .reply({
                embeds: [embed1],
                fetchReply: true,
            })
            .then(async (msg) => {
                forLoopDone = false;
                for (let r = 0; r < emoti.length; r++) {
                    await msg.react(emoti[r]);
                }
                forLoopDone = true;

                await setTimeout(async function () {
                    await msg.edit({
                        embeds: [embed2],
                    });
                }, 1000);

                const collector = await msg.createReactionCollector({ time: 10000 });
                const scheduledTime = Date.now();
                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name == specialEmoji.toString() && !coolUsers.includes(user) && coolUsers.length < firstUsers && !terribleUsers.includes(user)) {
                        coolUsers.push(user);
                        reactTimes.push(Date.now() - scheduledTime);
                    } else if (reaction.emoji.name != specialEmoji.toString() && !terribleUsers.includes(user.id) && !coolUsers.includes(user)) {
                        terribleUsers.push(user);
                    }
                    if (coolUsers.length > reactionNum) collector.stop('Enough reactions obtained');
                });

                collector.on('end', (collector) => {
                    console.log(`\nPeople who reacted correctly: ${coolUsers.length != 0 ? `${coolUsers.length}` : 'nobody!'}`);
                    console.log(`People who reacted incorrectly: ${terribleUsers.length != 0 ? `${terribleUsers.length}` : 'nobody!'}\n`);

                    const fields = coolUsers.map((v, i) => `${i + 1}.) ${v.tag}`);
                    for (var i = 0; i != fields.length; ++i)
                        embed3.fields.push({
                            name: fields[i],
                            value: `${reactTimes[i]}ms - ${coolUsers[i]}`,
                        });
                    if (coolUsers.length == 0 || coolUsers.length == 0) {
                        embed3.description = `Nobody reacted ${coolUsers.length == 0 ? 'correctly ' : ''}within the allotted time!`;
                        msg.reactions.removeAll();
                    }
                    msg.edit({
                        embeds: [embed3],
                    });
                });
            });

        inProgress = false;
    }
});

let inProgress = false;
let forLoopDone = true;
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    if (forLoopDone == true) return;
    terribleUsers.push(user);
});
client.login(TOKEN);
