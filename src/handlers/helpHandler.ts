import {CommandInteraction} from "discord.js"
import {list as commands} from "../commands/list"

type Option = {
    name: string
    description: string
}

type Command = {
    name?: string
    description?: string
    options: Option[]
}

export async function helpHandler(interaction: CommandInteraction): Promise<void> {
    // @ts-ignore
    const helpMessage = commands.map((command: Command) => {
        let commandOptionsName: string[] = []
        let commandOptionsDescription: string[] = []
        command.options.forEach((option: Option) => {
            commandOptionsName.push(`[${option.name}]`)
            commandOptionsDescription.push(`**[${option.name}]**: ${option.description}`)
        })

        let row = `**/${command.name}** ${commandOptionsName.join(' ')} - ${command.description}`
        if (commandOptionsDescription.length > 0) {
            row += `\n-# ${commandOptionsDescription.join('\n-# ')}\n`
        }

        return row
    }).join('\n')

    await interaction.reply({
        content: `## Вот список всех доступных команд:\n${helpMessage}`
    })
}