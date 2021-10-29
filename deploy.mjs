import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';

import dotenv from 'dotenv';
dotenv.config();
const { TOKEN, CLIENTID } = process.env;

const commands = [
    new SlashCommandBuilder()
        .setName('firstreaction')
        .setDescription('Sends an embed that gathers a random reaction. Then shows the first few users who reacted.')
        .addIntegerOption((option) => option.setName('reactions').setDescription('Amount of reactions to add.').setRequired(true))
        .addIntegerOption((option) => option.setName('usercount').setDescription('Number of first reactors to display.').setRequired(true)),
    new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates a given code.')
        .addStringOption((option) => option.setName('code').setDescription('Code to evaluate.').setRequired(true)),
    new SlashCommandBuilder().setName('thankyou').setDescription('Sends a thank you message.'),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(TOKEN);
rest.put(Routes.applicationCommands(CLIENTID), { body: commands })
    .then(async () => {
        console.log('Successfully registered application commands.');
        console.log(await eval(rest.get(Routes.applicationCommands(CLIENTID))));
    })
    .catch(console.error);
