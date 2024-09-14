import {MessageRepository} from "../repositories/MessageRepository"
import {ConfigRepository} from "../repositories/ConfigRepository"
import {Client, TextChannel, Role} from "discord.js"
import {Config} from "../entities/Config"

type GroupRow = {
    m_server_id: string
    m_channel_id: string
    m_user_id: string
    messageCount: number
}

export async function liberalize(client: Client) {
    const messageRepository = await MessageRepository()
    await messageRepository.deleteOldMessages()

    const groupedMessages = await messageRepository.getRawListByFilterGroupByChannel()

    for (let row of groupedMessages as GroupRow[]) {
        const guild = client.guilds.cache.get(row.m_server_id)
        if (!guild) {
            continue
        }

        const roleName = `${row.m_channel_id}-${row.m_user_id}-restricted`
        const role: Role | undefined = guild.roles.cache.find((r: Role) => r.name === roleName)
        if (!role) {
            continue
        }

        const channel = guild.channels.cache.get(row.m_channel_id) as TextChannel
        if (!channel) {
            continue
        }

        const configRepository = await ConfigRepository()
        const config: Config | null = await configRepository.getOneBy({
            serverId: row.m_server_id,
            channelId: row.m_channel_id,
            userId: row.m_user_id,
        })

        if (!config) {
            continue
        }

        if (row.messageCount < config.count) {
            console.log(`С пользователя ${row.m_user_id} сняты ограничения`)
            await channel.permissionOverwrites.edit(role, {
                SendMessages: null,
            })
        }
    }
}