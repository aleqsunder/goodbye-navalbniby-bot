import {Client, GatewayIntentBits, Guild, Routes} from 'discord.js'
import {initializeDatabase} from './database/db'
import {interactionCreateHandler} from './events/interactionCreate'
import {messageCreateHandler} from './events/messageCreate'
import {guildCreateHandler} from "./events/guildCreate"
import {registerCommands} from "./events/registerCommands"

import * as process from "process"
import {liberalize} from "./events/liberalizer"

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
})

client.on('ready', async () => {
    console.log(`Бот запущен как ${client.user?.tag}`)
    await initializeDatabase()
    await registerCommands(client)

    await liberalize(client)
    const interval: number = setInterval(async _ => await liberalize(client), 3e4)
})

client.on('interactionCreate', interactionCreateHandler)
client.on('messageCreate', messageCreateHandler)
client.on('guildCreate', (guild: Guild) => guildCreateHandler(guild, client))

const TOKEN: string = process.env.DISCORD_TOKEN || ''

client.login(TOKEN)
