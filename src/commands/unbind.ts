import {SlashCommandBuilder} from 'discord.js'

export const unbind = new SlashCommandBuilder()
    .setName('unbind')
    .setDescription('Снятие ограничения с пользователя')
    .addUserOption(option =>
        option.setName('пользователь')
            .setDescription('Выберите пользователя для снятия ограничения')
            .setRequired(true))
    .addChannelOption(option =>
        option.setName('канал')
            .setDescription('Выберите текстовый канал для снятия ограничения')
            .setRequired(true))
    .toJSON()