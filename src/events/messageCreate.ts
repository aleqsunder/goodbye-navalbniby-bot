import {Message as MessageType, Role, TextChannel, User} from 'discord.js'
import {MessageRepository} from "../repositories/MessageRepository"
import {ConfigRepository} from "../repositories/ConfigRepository"
import {Config} from "../entities/Config"
import {Message} from "../entities/Message"

export async function messageCreateHandler(message: MessageType): Promise<void> {
    if (message.author.bot) {
        return
    }

    const author: User = message.author
    const channel: TextChannel = message.channel as TextChannel
    const guild = message.guild
    if (!guild) {
        return
    }

    const filter = {
        serverId: guild.id,
        channelId: channel.id,
        userId: author.id,
    }

    const configRepository = await ConfigRepository()
    const config: Config | null = await configRepository.getOneBy(filter)

    if (!(config instanceof Config)) {
        return
    }

    const messageRepository = await MessageRepository()
    const messagesCount: number = await messageRepository.getCountBy(filter)

    if (messagesCount >= config.count) {
        const messages: Message | null = await messageRepository.getOneBy(filter)
        if (!messages) {
            return
        }

        const roleName = `${channel.id}-${author.id}-restricted`
        const role: Role | undefined = guild.roles.cache.find((r: Role) => r.name === roleName)
        if (!role) {
            return
        }

        await channel.permissionOverwrites.create(role, {
            SendMessages: false,
        })

        await message.delete()
        return
    }

    const newMessage: Message = new Message()
    newMessage.server_id = guild.id
    newMessage.channel_id = channel.id
    newMessage.user_id = author.id
    newMessage.user_message = message.id

    await messageRepository.save(newMessage)
}
