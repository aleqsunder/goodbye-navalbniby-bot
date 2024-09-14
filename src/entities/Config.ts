import "reflect-metadata"
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'
import {Snowflake} from "discord.js"

@Entity('configs')
export class Config {
    @PrimaryGeneratedColumn('uuid')
    id!: number

    @Column('text')
    server_id!: Snowflake

    @Column('text')
    channel_id!: Snowflake

    @Column('text')
    user_id!: Snowflake

    @Column('text')
    count!: number
}
