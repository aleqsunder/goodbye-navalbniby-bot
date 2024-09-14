import {CommandInteraction, Role, GuildMember, ChannelType, Snowflake} from "discord.js"
import {ConfigRepository} from "../repositories/ConfigRepository"
import {Config} from "../entities/Config"

export async function unbindHandler(interaction: CommandInteraction, options: any): Promise<void> {
    if (!interaction.isCommand()) {
        return
    }

    const user = options.getUser('пользователь')
    const channel = options.getChannel('канал')
    const guild = interaction.guild

    if (!guild) {
        await interaction.reply('Не удалось найти сервер, возможно всё это вокруг лишь иллюзия')
        return
    }

    if (channel.type !== ChannelType.GuildText) {
        await interaction.reply('Данного текстового канала не существует')
        return
    }

    const member: GuildMember | undefined = guild.members.cache.get(user.id)
    if (!member) {
        await interaction.reply(`Пользователь <@${user.id}> (debug > {replacement: ${user.username.replace(/[^a-zа-я0-9]/gi, '')}, id: ${user.id}}) не найден на сервере`)
        return
    }

    try {
        const configRepository = await ConfigRepository()
        const config: Config | null = await configRepository.getOneBy({
            serverId: guild.id,
            channelId: channel.id,
            userId: user.id,
        })

        const roleName = `${channel.id}-${user.id}-restricted`
        let role: Role | undefined = guild.roles.cache.find((r: Role) => r.name === roleName)
        if (role) {
            await role.delete(`Пользователь ${interaction.user.id} снял ограничения с пользователя ${user.username}`)
        }

        if (!(config instanceof Config)) {
            await interaction.reply(`Пользователь <@${user.id}> не был привязан к каналу <#${channel.id}>`)
            return
        }

        await configRepository.remove(config)
        await interaction.reply(`Пользователь <@${user.id}> успешно отвязан от канала <#${channel.id}>`)
    } catch (error) {
        console.error('Ошибка при удалении роли пользователя:', error)
        await interaction.reply(`Ошибка при удалении роли пользователя <@${user.id}> из канала <#${channel.id}>`)
    }
}