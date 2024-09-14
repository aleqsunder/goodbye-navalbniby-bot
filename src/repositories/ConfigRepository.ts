import "reflect-metadata"

import {SQLiteApp} from "../database/data-source-config"
import {Config} from "../entities/Config"
import {SelectQueryBuilder} from "typeorm"
import {FilterListConfigType} from "../types/filterListType"

export const ConfigRepository = async () => {
    return SQLiteApp.manager.getRepository(Config).extend({
        builder(): SelectQueryBuilder<Config> {
            return this.createQueryBuilder("c")
        },

        async getList(filter: FilterListConfigType = {}): Promise<Config[]> {
            const qb: SelectQueryBuilder<Config> = this.builder()
            return await this.filter(qb, filter).getMany()
        },

        async getOneBy(filter: FilterListConfigType = {}): Promise<Config|null> {
            const qb: SelectQueryBuilder<Config> = this.builder()
            return this.filter(qb, filter).getOne()
        },

        filter(qb: SelectQueryBuilder<Config>, filter: FilterListConfigType = {}): SelectQueryBuilder<Config> {
            if (!filter) {
                return qb
            }

            if (filter?.serverId) {
                qb = qb.andWhere("c.server_id = :serverId", {serverId: filter?.serverId})
            }

            if (filter?.channelId) {
                qb = qb.andWhere("c.channel_id = :channelId", {channelId: filter?.channelId})
            }

            if (filter?.userId) {
                qb = qb.andWhere("c.user_id = :userId", {userId: filter?.userId})
            }

            return qb
        },
    })
}