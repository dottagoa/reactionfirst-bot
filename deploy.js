const { REST, SlashCommandBuilder } = require('discord.js'),
    { Routes } = require('discord-api-types/v9');

require('dotenv').config();
const { TOKEN, CLIENTID } = process.env;

const commands = [
    new SlashCommandBuilder()
        .setName('firstreaction')
        .setDescription('Sends an embed that gathers a random reaction. Then shows the first few users who reacted.')
        .addIntegerOption((option) => option.setName('reactions').setDescription('Amount of reactions to add.').setRequired(true))
        .addIntegerOption((option) => option.setName('usercount').setDescription('Number of first reactors to display.').setRequired(true))
        .addStringOption((option) => option.setName('difficulty').setDescription('Difficulty level (basic or expert).').setRequired(true).addChoices({ name: 'Basic (Easy)', value: 'basic' }, { name: 'Expert (Hard)', value: 'expert' })),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(TOKEN);
rest.put(Routes.applicationCommands(CLIENTID), { body: commands })
    .then(async () => {
        console.log('Successfully registered application commands.');
    })
    .catch(console.error);
