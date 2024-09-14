import "reflect-metadata"
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"
import {Snowflake} from "discord.js"

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id!: number

    @Column('text')
    server_id!: Snowflake

    @Column('text')
    channel_id!: Snowflake

    @Column('text')
    user_id!: Snowflake

    @Column('text')
    user_message!: Snowflake

    @Column({type: 'text', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: string
}