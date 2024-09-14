import 'reflect-metadata'
import path from 'path'

import {SqliteConnectionOptions} from "typeorm/driver/sqlite/SqliteConnectionOptions"
import {DataSource} from 'typeorm'
import {Config} from "../entities/Config"
import {Message} from "../entities/Message"

const entitiesList: Array<object> = [Config, Message]

export const SQLiteApp = new DataSource({
    type: 'sqlite',
    database: path.join(process.cwd(), '/discord_bot.db'),
    entities: entitiesList,
    synchronize: true,
    entitySkipConstructor: true,
} as SqliteConnectionOptions)