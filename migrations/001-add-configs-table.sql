--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE configs (
    id INTEGER PRIMARY KEY,
    server_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    count INTEGER NOT NULL,

    UNIQUE (server_id, channel_id, user_id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE configs;