import fs from 'fs';
import ms from 'ms';
import { Client, Collection, Intents, MessageEmbed } from 'discord.js';
import env from './config.json';
import * as util from './util.mjs';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    if (forLoopDone) return;
    reaction.users.remove();
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

        // -- APPLICATION CONSTANTS -- //
        const reactionNum = interaction.options.get('reactions').value; // argument: reaction count
        const firstUsers = interaction.options.get('usercount').value; // argument: first X users to show
        const emoti = util.getRandom(emojiList, reactionNum); // get random emojis from the list above
        const specialEmoji = util.getRandom(emoti, 1); // choose single emoji for first reactors
        const coolUsers = [];
        const terribleUsers = [];
        const reactTimes = [];
        let embed1 = {
            title: 'Reaction test! (preprocessing)',
            description: "**PLEASE WAIT!** I'm adding the reactions, then I'll show you the emoji to choose!",
        };
        let embed2 = {
            title: 'Reaction test! (in progress)',
            description: `Click the ${specialEmoji} reaction as fast as you can. The first ${firstUsers} people to react will be seen below.`,
        };
        let embed3 = {
            title: 'Reaction test! (complete)',
            description: "Here's a list of the people who reacted, in order from the first reaction to the fifth:",
            fields: [],
        };

        // -- INITIAL MESSAGE -- //
        if (reactionNum >= emojiList.length)
            return interaction.reply({
                content: "Can't complete request -- your reaction count is larger than the amount of available emojis.",
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
                await msg.edit({
                    embeds: [embed2]
                });

                const collector = await msg.createReactionCollector({ time: 10000 });
                const scheduledTime = Date.now();
                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name == specialEmoji.toString() && !coolUsers.includes(user.id) && coolUsers.length < reactionNum) {
                        coolUsers.push(user);
                        reactTimes.push(Date.now() - scheduledTime);
                    } else if (reaction.emoji.name != specialEmoji.toString() && !terribleUsers.includes(user.id) && !coolUsers.includes(user.id)) {
                        terribleUsers.push(user);
                    }
                    if (coolUsers.length < reactionNum) collector.stop("Enough reactions obtained");
                });

                collector.on('end', (collector) => {
                    console.log(`\nPeople who reacted correctly: ${coolUsers.length != 0 ? coolUsers.join(', ') : 'nobody!'}`);
                    console.log(`People who reacted incorrectly: ${terribleUsers.length != 0 ? terribleUsers.join(', ') : 'nobody!'}\n`);

                    const fields = coolUsers.map((v, i) => `${i+1}.) ${v.tag}`);
                    for (var i = 0; i != fields.length; ++i) embed3.fields.push({
                        name: fields[i],
                        value: `${reactTimes[i]}ms - ${coolUsers[i]}`
                    });
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
client.login(env.token);
