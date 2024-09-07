CREATE EXTENSION "pgcrypto";
CREATE EXTENSION "btree_gist";



CREATE TABLE concept (
    id                     UUID        PRIMARY KEY,
    operation_concept_id   UUID        NOT NULL,
    transaction_concept_id UUID        NOT NULL,
    transaction_date       TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_concept_operation_concept_id
ON concept
USING HASH (operation_concept_id);

CREATE INDEX idx_concept_transaction_concept_id
ON concept
USING HASH (transaction_concept_id);



CREATE TABLE user_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,

    transaction_date TIMESTAMPTZ NOT NULL,

    -- Private data (MUTABLE)
    email              TEXT NOT NULL UNIQUE,
    encrypted_password TEXT NOT NULL,
    is_admin           BOOL NOT NULL,
    restricted_access  BOOL NOT NULL,
    suspended_account  BOOL NOT NULL
);



-- Private data (DELETABLE)
CREATE TABLE user_session (
    id UUID PRIMARY KEY,
    secret_key UUID NOT NULL,

    user_id    UUID NOT NULL REFERENCES user_concept,
    csrf_token UUID NOT NULL UNIQUE,

    ip                        TEXT        NOT NULL,
    user_agent_request_header TEXT        NOT NULL,
    start_date                TIMESTAMPTZ NOT NULL,

    -- (MUTABLE)
    last_request_date TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_user_session_user_id
ON user_session
USING HASH (user_id);

CREATE INDEX idx_user_session_secret_key
ON user_session
USING HASH (secret_key);



CREATE TABLE operation_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,
    user_concept_id UUID NOT NULL REFERENCES user_concept DEFERRABLE INITIALLY DEFERRED,
    start_date TIMESTAMPTZ NOT NULL,

    -- (MUTABLE)
    end_date TIMESTAMPTZ NULL
);

CREATE INDEX idx_operation_concept_user_concept_id
ON operation_concept
USING HASH (user_concept_id);



CREATE TABLE transaction_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,
    operation_concept_id UUID NOT NULL REFERENCES operation_concept,
    transaction_date TIMESTAMPTZ NOT NULL
);

ALTER TABLE concept
ADD CONSTRAINT fk_concept_operation
FOREIGN KEY (operation_concept_id) REFERENCES operation_concept(concept_id)
DEFERRABLE INITIALLY DEFERRED,
ADD CONSTRAINT fk_concept_transaction
FOREIGN KEY (transaction_concept_id) REFERENCES transaction_concept(concept_id)
DEFERRABLE INITIALLY DEFERRED;

CREATE INDEX idx_transaction_concept_operation_concept_id
ON transaction_concept
USING HASH (operation_concept_id);



CREATE TABLE number_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,

    number_value NUMERIC NOT NULL UNIQUE,

    transaction_date TIMESTAMPTZ NOT NULL
);



CREATE TABLE text_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,

    text_value TEXT NOT NULL UNIQUE,

    transaction_date TIMESTAMPTZ NOT NULL
);



CREATE TABLE magnitude_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,

    concept_id_magnitude UUID NOT NULL REFERENCES concept,
    number_range_value NUMRANGE NOT NULL,

    transaction_date TIMESTAMPTZ NOT NULL,

    UNIQUE (concept_id_magnitude, number_range_value)
);

CREATE INDEX idx_magnitude_concept_number_range_value
ON magnitude_concept
USING GIST (number_range_value range_ops);



CREATE TABLE relation_rule (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),

    concept_id UUID NOT NULL REFERENCES concept,

    concept_id_abstraction UUID NOT NULL REFERENCES concept,
    concept_id_property    UUID NOT NULL REFERENCES concept,

    max_relation_number INT8 NULL CHECK (max_relation_number > 0),

    fixed_order        BOOL NOT NULL,
    unique_per_branch  BOOL NOT NULL,
    unique_per_concept BOOL NOT NULL,

    is_active              BOOL          NOT NULL,
    transaction_date       TIMESTAMPTZ   NOT NULL,
    operation_concept_id   UUID NOT NULL REFERENCES operation_concept,
    transaction_concept_id UUID NOT NULL REFERENCES transaction_concept
);

CREATE INDEX idx_relation_rule_concept_id
ON relation_rule
USING HASH (concept_id);

CREATE INDEX idx_relation_rule_abstraction_property
ON relation_rule
USING BTREE (concept_id_abstraction, concept_id_property);

CREATE INDEX idx_relation_rule_operation_concept_id
ON relation_rule
USING HASH (operation_concept_id);

CREATE INDEX idx_relation_rule_transaction_concept_id
ON relation_rule
USING HASH (transaction_concept_id);



CREATE VIEW active_relation_rule AS
WITH cte AS (
    SELECT
        ROW_NUMBER() OVER (
            PARTITION BY concept_id_abstraction, concept_id_property
            ORDER BY transaction_date DESC
        ) AS row_number,
        concept_id,
        concept_id_abstraction,
        concept_id_property,
        max_relation_number,
        fixed_order,
        unique_per_branch,
        unique_per_concept,
        is_active,
        transaction_date,
        operation_concept_id,
        transaction_concept_id
    FROM relation_rule
) 
SELECT
    concept_id,
    concept_id_abstraction,
    concept_id_property,
    max_relation_number,
    fixed_order,
    unique_per_branch,
    unique_per_concept,
    transaction_date,
    operation_concept_id,
    transaction_concept_id
FROM cte
WHERE row_number = 1 AND is_active;



CREATE TABLE relation (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),

    concept_id_concept      UUID  NOT NULL REFERENCES concept,
    concept_id_abstraction  UUID  NOT NULL REFERENCES concept,
    concept_id_property     UUID  NOT NULL REFERENCES concept,
    order_number            INT8  NOT NULL CHECK (order_number > 0),
    concept_id_quality      UUID  NOT NULL REFERENCES concept,
    concept_id_quality_type UUID  NOT NULL REFERENCES concept,

    is_active              BOOL          NOT NULL,
    transaction_date       TIMESTAMPTZ   NOT NULL,
    operation_concept_id   UUID NOT NULL REFERENCES operation_concept,
    transaction_concept_id UUID NOT NULL REFERENCES transaction_concept,

    relation_id_source UUID NOT NULL,
    concept_id_source  UUID NOT NULL,

    UNIQUE (id, concept_id_concept),
    FOREIGN KEY (relation_id_source, concept_id_source)
    REFERENCES relation (id, concept_id_concept)
    DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_relation_concept_id_concept
ON relation
USING HASH (concept_id_concept);

CREATE INDEX idx_relation_operation_concept_id
ON relation
USING HASH (operation_concept_id);

CREATE INDEX idx_relation_transaction_concept_id
ON relation
USING HASH (transaction_concept_id);



CREATE VIEW active_relation AS
WITH cte AS (
    SELECT
        ROW_NUMBER() OVER (
            PARTITION BY concept_id_concept, relation_id_source
            ORDER BY transaction_date DESC
        ) AS row_number,
        id,
        concept_id_concept,
        concept_id_abstraction,
        concept_id_property,
        order_number,
        concept_id_quality,
        concept_id_quality_type,
        is_active,
        transaction_date,
        operation_concept_id,
        transaction_concept_id,
        relation_id_source,
        concept_id_source
    FROM relation
) 
SELECT
    id,
    concept_id_concept,
    concept_id_abstraction,
    concept_id_property,
    order_number,
    concept_id_quality,
    concept_id_quality_type,
    transaction_date,
    operation_concept_id,
    transaction_concept_id,
    relation_id_source,
    concept_id_source
FROM cte
WHERE row_number = 1 AND is_active;
