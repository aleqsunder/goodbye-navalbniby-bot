import {SlashCommandBuilder} from 'discord.js'

export const bind = new SlashCommandBuilder()
    .setName('bind')
    .setDescription('Настройка ограничения на пользователя')
    .addUserOption(option =>
        option.setName('пользователь')
            .setDescription('Выберите пользователя для настройки')
            .setRequired(true))
    .addChannelOption(option =>
        option.setName('канал')
            .setDescription('Выберите текстовый канал для ограничения')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('количество')
            .setDescription('Кол-во разрешённых сообщений для пользователя. Минимальное значение - 1')
            .setMinValue(1)
            .setRequired(true))
    .toJSON()