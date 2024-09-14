import sqlite3 from 'sqlite3'
import {open, Database} from 'sqlite'
import path from 'path'
import {SQLiteApp} from "./data-source-config"

export let db: Database

export async function initializeDatabase() {
    db = await open({
        filename: path.join('discord_bot.db'),
        driver: sqlite3.Database
    })

    try {
        await db.migrate()
        await SQLiteApp.initialize()
    } catch (error) {
        console.log('Ошибка миграции:', error)
    }
}
