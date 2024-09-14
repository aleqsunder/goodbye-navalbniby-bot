import "reflect-metadata"

import {SQLiteApp} from "../database/data-source-config"
import {Message} from "../entities/Message"
import {SelectQueryBuilder} from "typeorm"
import {FilterListMessageType} from "../types/filterListType"

export const MessageRepository = async () => {
    return SQLiteApp.manager.getRepository(Message).extend({
        builder(): SelectQueryBuilder<Message> {
            return this.createQueryBuilder("m")
                .orderBy('m.timestamp', 'ASC')
        },

        async getList(filter: FilterListMessageType = {}): Promise<Message[]> {
            const qb: SelectQueryBuilder<Message> = this.builder()
            return await this.filter(qb, filter).getMany()
        },

        async getOneBy(filter: FilterListMessageType = {}): Promise<Message|null> {
            const qb: SelectQueryBuilder<Message> = this.builder()
            return this.filter(qb, filter).getOne()
        },

        async getCountBy(filter: FilterListMessageType = {}): Promise<number> {
            const qb: SelectQueryBuilder<Message> = this.builder()
            return await this.filter(qb, filter).getCount()
        },

        async deleteOldMessages(): Promise<void> {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

            await this.createQueryBuilder()
                .delete()
                .where('timestamp < :date', {date: oneDayAgo.toISOString()})
                .execute()
        },

        async getRawListByFilterGroupByChannel() {
            return await this.builder()
                .select("m.server_id")
                .addSelect("m.channel_id")
                .addSelect("m.user_id")
                .addSelect("COUNT(m.id)", "messageCount")
                .groupBy('m.server_id')
                .addGroupBy("m.channel_id")
                .addGroupBy("m.user_id")
                .getRawMany()
        },

        filter(qb: SelectQueryBuilder<Message>, filter: FilterListMessageType = {}): SelectQueryBuilder<Message> {
            if (!filter) {
                return qb
            }

            if (filter?.serverId) {
                qb = qb.andWhere("m.server_id = :serverId", {serverId: filter?.serverId})
            }

            if (filter?.channelId) {
                qb = qb.andWhere("m.channel_id = :channelId", {channelId: filter?.channelId})
            }

            if (filter?.userId) {
                qb = qb.andWhere("m.user_id = :userId", {userId: filter?.userId})
            }

            if (filter?.userMessage) {
                qb = qb.andWhere("m.user_message = :userId", {userMessage: filter?.userMessage})
            }

            return qb
        },
    })
}