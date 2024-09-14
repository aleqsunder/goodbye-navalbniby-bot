import {ChatInputCommandInteraction, Interaction, PermissionsBitField} from 'discord.js'
import {bindHandler} from '../handlers/bindHandler'
import {unbindHandler} from "../handlers/unbindHandler"
import {helpHandler} from "../handlers/helpHandler"

export async function interactionCreateHandler(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
        return
    }

    // @ts-ignore
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        await (interaction as ChatInputCommandInteraction).reply('У вас нет прав))')
        return
    }

    const {commandName, options} = interaction
    switch (commandName) {
        case 'bind': return await bindHandler(interaction as ChatInputCommandInteraction, options)
        case 'unbind': return await unbindHandler(interaction as ChatInputCommandInteraction, options)
        case 'help': return await helpHandler(interaction as ChatInputCommandInteraction)
    }
}
