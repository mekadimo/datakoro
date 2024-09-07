-- @param {String} $1:concept_id
-- @param {String} $2:concept_id_magnitude
-- @param {Boolean} $3:number_range_min_value_is_infinity
-- @param {Decimal} $4:number_range_min_value
-- @param {Boolean} $5:number_range_max_value_is_infinity
-- @param {Decimal} $6:number_range_max_value
-- @param {DateTime} $7:transaction_date
INSERT INTO magnitude_concept (
    concept_id,
    concept_id_magnitude,
    number_range_value,
    transaction_date
)
VALUES (
    $1,
    $2,
    NUMRANGE(
        CASE
            WHEN $3
            THEN NULL::NUMERIC
            ELSE $4
        END,
        CASE
            WHEN $5
            THEN NULL::NUMERIC
            ELSE $6
        END,
        '[]'
    ),
    $7
)
