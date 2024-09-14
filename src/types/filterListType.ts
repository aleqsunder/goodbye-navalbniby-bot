import {Snowflake} from "discord.js"

export type FilterListConfigType = {
    serverId?: Snowflake,
    channelId?: Snowflake,
    userId?: Snowflake,
}

export type FilterListMessageType = FilterListConfigType & {
    userMessage?: Snowflake,
}