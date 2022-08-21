const { Stopwatch } = require('@sapphire/stopwatch'),
    { Type } = require('@sapphire/type'),
    { codeBlock } = require('@sapphire/utilities'),
    { inspect } = require('util');

require('dotenv').config();
const { TOKEN } = process.env;

const utils = require('./utilities');

const { Client, GatewayIntentBits } = require('discord.js'),
    client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
    });

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('error', (e) => {
    console.error(e);
});

const debug = false; // set to 'true' to enable debug logging

function log(message) {
    if (debug) return console.log(message);
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    await interaction.deferReply();

    if (commandName === 'firstreaction') {
        // -- USER VARIABLES -- //
        const time = 15000; // time for reactions to be collected before timing out (in ms)

        // -- ARGUMENTS -- //
        const reactionNum = interaction.options.get('reactions').value; // argument: reaction count
        const firstUsers = interaction.options.get('usercount').value; // argument: first X users to show
        const difficulty = interaction.options.get('difficulty').value; // argument: difficulty level (basic or expert)

        // -- EMOJI LIST -- //
        const emoji = require('./emoji.json');
        const emojiList = emoji[difficulty];

        // -- VARIABLE CHECKS -- //
        if (reactionNum < 1) return interaction.editReply({ content: 'I need to be able to react with at least one emoji!', ephemeral: true });
        if (firstUsers < 1) return interaction.editReply({ content: 'You must specify at least one user that has to react!', ephemeral: true });
        if (reactionNum > emojiList.length)
            return interaction.editReply({ content: 'Your reaction count is larger than the amount of available emojis!', ephemeral: true });

        // -- APPLICATION CONSTANTS -- //
        const min = 3; // minimum time IN FULL SECONDS
        const max = 7; // maximum time IN FULL SECONDS
        const delay = (Math.random() * (max - min) + min) * 1000; // delay in milliseconds between min and max
        const emoti = utils.getRandom(emojiList, reactionNum); // get random emojis from the list above
        const specialEmoji = utils.getRandom(emoti, 1); // choose single emoji for first reactors to react with
        const coolUsers = [];
        const terribleUsers = [];

        // -- EMBEDS -- //
        let embed1 = {
            title: 'Preparing reaction test!',
            description: 'Please wait.',
            color: 0x2f3136,
        };
        let embed2 = {
            title: 'Get ready to react...',
            description: 'If you react before an emoji is chosen, you will be disqualified!',
            color: 0x2f3136,
        };
        // prettier-ignore
        let embed3 = {
            title: 'Reaction test in progress!',
            description: `Click the ${specialEmoji} reaction as fast as you can.\n\nThe **first ${firstUsers == 1 ? `person` : `${firstUsers} people`}** to react will be seen below.\n\nIf you clicked a reaction before this prompt appeared, you're disqualified this round.`,
            color: 0xffff00,
        };
        // prettier-ignore
        let embed4 = {
            title: 'Reaction test complete!',
            description: `Here's **${firstUsers == 1 ? `the first person` : `a list of the ${firstUsers} people`}** who reacted before anyone else${firstUsers != 1 ? ', in the order of how fast they responded:' : '!'
                }`,
            fields: [],
            color: 0x47ffa0,
        };

        const filter = (reaction, user) => {
            return reaction.emoji.name === specialEmoji.toString();
        };

        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return;
            if (forLoopDone == true) return;
            terribleUsers.push(user);
        });

        await interaction.editReply({ embeds: [embed1] }).then(async (msg) => {
            forLoopDone = false;
            for (let r = 0; r < emoti.length; r++) {
                await msg.react(emoti[r]);
            }

            await msg.edit({ embeds: [embed2] });
            setTimeout(async function () {
                await msg.edit({
                    embeds: [embed3],
                });
                baseTime = Date.now();
            }, delay);
            forLoopDone = true;

            const collector = await msg.createReactionCollector({ time });
            await log(
                [
                    '\nReaction collector has been created.',
                    `Collector created by ${interaction.user.tag}\n`,
                    `Time to react: ${time / 1000}s`,
                    `Emoji count: ${reactionNum}`,
                    `Special emoji that users need to react to: ${specialEmoji.toString()}`,
                    `First users to react: ${firstUsers}\n`,
                    `-- STARTING REACTION TEST FOR "${interaction.guild.name.toUpperCase()}" --`,
                ].join('\n')
            );

            collector.on('collect', (reaction, user) => {
                // @prettier-ignore
                log(
                    [
                        `Is this the special emoji? ${reaction.emoji.name === specialEmoji.toString()}`,
                        `Is the user part of the coolUsers array? ${coolUsers.includes(coolUsers.find((o) => o.user == user))}`,
                        `Is coolUsers longer than the first reaction tickets? ${coolUsers.length > reactionNum}`,
                        `Is the user part of the terribleUsers array? ${terribleUsers.includes(coolUsers.find((o) => o.user == user))}`,
                    ].join('\n')
                );
                if (
                    reaction.emoji.name == specialEmoji.toString() &&
                    !coolUsers.includes(coolUsers.find((o) => o.user == user)) &&
                    coolUsers.length < firstUsers &&
                    !terribleUsers.includes(coolUsers.find((o) => o.user == user))
                ) {
                    coolUsers.push({
                        user,
                        time: ((Date.now() - baseTime) / 1000).toFixed(1),
                    });
                    log(
                        `User ${user.tag} reacted ${utils.ordinal(coolUsers.indexOf(coolUsers.find((o) => o.user == user)) + 1)} with ${
                            reaction.emoji.name
                        } in ${((Date.now() - baseTime) / 1000).toFixed(1)}s`
                    );
                } else if (reaction.emoji.name != specialEmoji.toString() && !terribleUsers.includes(user) && !coolUsers.includes(user)) {
                    terribleUsers.push(user);
                    log(`User ${user.tag} reacted incorrectly with ${reaction.emoji.name}`);
                }
                // if (coolUsers.length >= firstUsers) return collector.stop('enough reactions obtained'); // shh! this is a secret! if you enable this, the collector will end early if it gets all it needs!
            });

            collector.on('end', (collector, reason) => {
                log(`-- REACTION TEST IN "${interaction.guild.name.toUpperCase()}" ENDED --\n`);
                const fields = coolUsers.map((v, i) => (coolUsers.length > 1 ? `${utils.ordinal(i + 1)} place:` : 'Our winner is...'));
                for (var i = 0; i != fields.length; ++i)
                    embed4.fields.push({
                        name: fields[i],
                        value: `${coolUsers[i].user} *(${coolUsers[i].time}s)*`,
                    });
                if (coolUsers.length == 0) {
                    embed4.description = `Nobody reacted ${terribleUsers.length > 0 ? 'correctly ' : ''}within the allotted time!`;
                    embed4.color = 0xff5252;
                    msg.reactions.removeAll();
                }
                msg.edit({
                    embeds: [embed4],
                });
            });
        });
    }
});

let forLoopDone = true;
let baseTime = 0;
client.login(TOKEN);
