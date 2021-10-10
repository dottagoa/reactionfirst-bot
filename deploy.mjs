import { readdirSync } from "fs";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from "@discordjs/builders";
import env from "./config.json";

const commands = [
    new SlashCommandBuilder()
        .setName('firstreaction')
        .setDescription('Sends an embed that gathers a random reaction. Then shows the first few users who reacted.')
        .addIntegerOption((option) => option.setName('reactions')
            .setDescription('Amount of reactions to add.')
            .setRequired(true)
        )
        .addIntegerOption((option) => option.setName('usercount')
            .setDescription('Number of first reactors to display.')
            .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(env.token);
rest.put(Routes.applicationCommands(env.clientId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
