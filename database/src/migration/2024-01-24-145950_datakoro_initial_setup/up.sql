CREATE EXTENSION "pgcrypto";
CREATE EXTENSION "btree_gist";

CREATE TABLE concept (
    id UUID PRIMARY KEY,

    transaction_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,

    transaction_date TIMESTAMPTZ NOT NULL,

    -- Private data (MUTABLE)
    email              TEXT NOT NULL UNIQUE,
    encrypted_password TEXT NOT NULL,
    is_admin           BOOL NOT NULL,
    restricted_access  BOOL NOT NULL
);

-- Private data (DELETABLE)
CREATE TABLE user_session (
    id UUID PRIMARY KEY,

    user_id    UUID NOT NULL REFERENCES user_concept,
    csrf_token UUID NOT NULL UNIQUE,

    ip                        TEXT        NOT NULL,
    user_agent_request_header TEXT        NOT NULL,
    start_date                TIMESTAMPTZ NOT NULL,

    -- MUTABLE
    last_request_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE operation_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,

    transaction_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE text_concept (
    concept_id UUID PRIMARY KEY REFERENCES concept,

    text_value TEXT NOT NULL UNIQUE,

    transaction_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE relation (
    id UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),

    concept_id_concept     UUID  NOT NULL REFERENCES concept,
    concept_id_abstraction UUID  NOT NULL REFERENCES concept,
    concept_id_property    UUID  NOT NULL REFERENCES concept,
    order_number           INT8  NOT NULL,
    concept_id_quality     UUID  NOT NULL REFERENCES concept,

    is_active            BOOL          NOT NULL,
    transaction_date     TIMESTAMPTZ   NOT NULL,
    operation_concept_id UUID NOT NULL REFERENCES operation_concept,

    extra_data JSONB NULL,

    relation_id_source UUID NOT NULL,
    concept_id_source  UUID NOT NULL,
    FOREIGN KEY (relation_id_source, concept_id_source)
    REFERENCES relation (id, concept_id_concept)
);

CREATE TABLE abstraction_relation (
    relation_id UUID PRIMARY KEY REFERENCES relation,

    concept_id_concept UUID NOT NULL REFERENCES concept,
    order_number       INT8 NOT NULL,
    concept_id_quality UUID NOT NULL REFERENCES concept,
    FOREIGN KEY (relation_id, concept_id_concept, order_number, concept_id_quality)
    REFERENCES relation (id, concept_id_concept, order_number, concept_id_quality)

    is_active        BOOL        NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE property_relation (
    id UUID PRIMARY KEY REFERENCES relation,

    concept_id_concept     UUID NOT NULL REFERENCES concept,
    concept_id_abstraction UUID NOT NULL REFERENCES concept,
    order_number           INT8 NOT NULL,
    concept_id_quality     UUID NOT NULL REFERENCES concept,
    FOREIGN KEY (relation_id, concept_id_concept, concept_id_abstraction, order_number, concept_id_quality)
    REFERENCES relation (id, concept_id_concept, concept_id_abstraction, order_number, concept_id_quality)

    is_active        BOOL        NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL,

    quality_amount_range           INT8RANGE NOT NULL,
    unique_quality_per_concept     BOOL      NOT NULL,
    unique_quality_per_abstraction BOOL      NOT NULL,
    fixed_quality_order            BOOL      NOT NULL
);

CREATE TABLE magnitude_relation (
    id UUID PRIMARY KEY REFERENCES relation,

    concept_id_concept     UUID  NOT NULL REFERENCES concept,
    concept_id_abstraction UUID  NOT NULL REFERENCES concept,
    order_number           INT8  NOT NULL,
    concept_id_quality     UUID  NOT NULL REFERENCES concept,
    FOREIGN KEY (relation_id, concept_id_concept, concept_id_abstraction, order_number, concept_id_quality)
    REFERENCES relation (id, concept_id_concept, concept_id_abstraction, order_number, concept_id_quality)

    is_active        BOOL        NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL,

    numeric_range NUMRANGE NOT NULL
);
