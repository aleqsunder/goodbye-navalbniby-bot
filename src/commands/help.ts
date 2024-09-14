import {SlashCommandBuilder} from 'discord.js'

export const help = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Показывает список всех доступных команд')
    .toJSON()