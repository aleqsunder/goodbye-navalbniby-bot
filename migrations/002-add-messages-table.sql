--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    server_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_message_id BIGINT NOT NULL UNIQUE,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (server_id, channel_id, user_id, user_message_id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE messages;