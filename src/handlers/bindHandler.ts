import {ChatInputCommandInteraction, GuildMember, Role, ChannelType} from 'discord.js'
import {ConfigRepository} from "../repositories/ConfigRepository"
import {Config} from "../entities/Config"

export async function bindHandler(interaction: ChatInputCommandInteraction, options: any): Promise<void> {
    if (!interaction.isCommand()) {
        return
    }

    const user = options.getUser('пользователь')
    const channel = options.getChannel('канал')
    const count = options.getInteger('количество')
    const guild = interaction.guild

    if (!guild) {
        await interaction.reply('Не удалось найти сервер, возможно всё это вокруг лишь иллюзия')
        return
    }
    if (channel.type !== ChannelType.GuildText) {
        await interaction.reply('Данного текстового канала не существует')
        return
    }

    const roleName = `${channel.id}-${user.id}-restricted`

    let role: Role | undefined = guild.roles.cache.find((r: Role) => r.name === roleName)
    if (!role) {
        try {
            role = await guild.roles.create({
                name: roleName,
                color: '#0000FF',
                permissions: []
            })
        } catch (error) {
            console.error('Ошибка при создании роли и настройке разрешений:', error)
            await interaction.reply('Не удалось создать роль или изменить разрешения')
            return
        }
    }

    const member: GuildMember | undefined = guild.members.cache.get(user.id)
    if (!member) {
        await interaction.reply(`Пользователь <@${user.id}> (debug > {replacement: ${user.username.replace(/[^a-zа-я0-9]/gi, '')}, id: ${user.id}}) не найден на сервере`)
        return
    }

    try {
        const configRepository = await ConfigRepository()
        const existConfig: Config | null = await configRepository.getOneBy({
            serverId: guild.id,
            channelId: channel.id,
            userId: user.id,
        })

        if (existConfig instanceof Config) {
            await interaction.reply(`Пользователь <@${user.id}> уже ограничен в канале <#${channel.id}>`)
            return
        }

        await member.roles.add(role)
        console.log(`Роль <@&${role.id}> добавлена пользователю <@${user.id}> в канале <#${channel.id}>`)

        const config = new Config()
        config.server_id = guild.id
        config.channel_id = channel.id
        config.user_id = user.id
        config.count = count

        await configRepository.save(config)
        await interaction.reply(`Ограничение <@&${role.id}> успешно добавлено пользователю <@${user.id}> и настроено для канала <#${channel.id}>`)
    } catch (error) {
        console.error('Ошибка при добавлении роли пользователю:', error)
        await interaction.reply('Не удалось добавить роль пользователю')
    }
}
