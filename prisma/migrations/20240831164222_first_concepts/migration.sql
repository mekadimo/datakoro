CREATE FUNCTION add_fundamental_concept(input_concept_id UUID)
RETURNS VOID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;
BEGIN
    INSERT INTO concept (
        id,
        operation_concept_id,
        transaction_concept_id,
        transaction_date
    ) VALUES (
        input_concept_id,
        cid_datakoro_first_operation(),
        cid_datakoro_first_transaction(),
        first_transaction_date_value
    );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION add_original_relation(
    input_concept_id UUID,
    input_abstraction_id UUID,
    input_property_id UUID,
    input_quality_id UUID
)
RETURNS VOID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;
    relation_id UUID := GEN_RANDOM_UUID();
BEGIN
    INSERT INTO relation (
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
    ) VALUES (
        relation_id,
        input_concept_id,
        input_abstraction_id,
        input_property_id,
        1,
        input_quality_id,
        cid_concept(),
        TRUE,
        first_transaction_date_value,
        cid_datakoro_first_operation(),
        cid_datakoro_first_transaction(),
        relation_id,
        input_concept_id
    );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION add_text_relation(
    input_concept_id UUID,
    input_abstraction_id UUID,
    input_property_id UUID,
    input_quality_id UUID
)
RETURNS VOID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;
    relation_id UUID := GEN_RANDOM_UUID();
BEGIN
    INSERT INTO relation (
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
    ) VALUES (
        relation_id,
        input_concept_id,
        input_abstraction_id,
        input_property_id,
        1,
        input_quality_id,
        cid_datakoro_text(),
        TRUE,
        first_transaction_date_value,
        cid_datakoro_first_operation(),
        cid_datakoro_first_transaction(),
        relation_id,
        input_concept_id
    );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION inherit_relations(
    input_concept_id UUID,
    input_abstraction_id UUID
)
RETURNS VOID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;
BEGIN
    INSERT INTO relation (
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
    )
    SELECT
        input_concept_id,
        r1.concept_id_abstraction,
        r1.concept_id_property,
        r1.order_number,
        r1.concept_id_quality,
        r1.concept_id_quality_type,
        TRUE,
        first_transaction_date_value,
        cid_datakoro_first_operation(),
        cid_datakoro_first_transaction(),
        r1.relation_id_source,
        r1.concept_id_source
    FROM relation r1
    WHERE
        r1.concept_id_concept = input_abstraction_id
        AND r1.concept_id_source <> input_concept_id
        AND NOT EXISTS(
            SELECT 1
            FROM relation r2
            WHERE
                r2.concept_id_concept = input_concept_id
                AND r2.relation_id_source = r1.relation_id_source
            LIMIT 1
        );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION add_first_concept(
    input_concept_id UUID,
    input_abstraction_id UUID
)
RETURNS VOID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;
BEGIN
    INSERT INTO concept (
        id,
        operation_concept_id,
        transaction_concept_id,
        transaction_date
    ) VALUES (
        input_concept_id,
        cid_datakoro_first_operation(),
        cid_datakoro_first_transaction(),
        first_transaction_date_value
    );

    PERFORM add_original_relation(
        input_concept_id,
        cid_abstraction(),
        cid_abstraction(),
        input_concept_id
    );

    PERFORM inherit_relations(
        input_concept_id,
        input_abstraction_id
    );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION add_relation_rule(
    input_abstraction_id UUID,
    input_property_id UUID,
    max_relation_number_value INT,
    fixed_order BOOL,
    unique_per_branch BOOL,
    unique_per_concept BOOL
)
RETURNS VOID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;

    input_relation_rule_id UUID := GEN_RANDOM_UUID();
BEGIN
    PERFORM add_first_concept(
        input_relation_rule_id,
        cid_datakoro_relation_rule()
    );

    INSERT INTO relation_rule (
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
    ) VALUES (
        input_relation_rule_id,
        input_abstraction_id,
        input_property_id,
        max_relation_number_value,
        fixed_order,
        unique_per_branch,
        unique_per_concept,
        TRUE,
        first_transaction_date_value,
        cid_datakoro_first_operation(),
        cid_datakoro_first_transaction()
    );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION add_text(input_text_value TEXT)
RETURNS UUID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;

    text_concept_id UUID;
BEGIN
    SELECT concept_id INTO text_concept_id
    FROM text_concept
    WHERE text_value = input_text_value
    LIMIT 1;

    IF text_concept_id IS NOT NULL THEN
        RETURN text_concept_id;
    END IF;

    text_concept_id := GEN_RANDOM_UUID();

    PERFORM add_first_concept(
        text_concept_id,
        cid_datakoro_text()
    );

    INSERT INTO text_concept (
        concept_id,
        text_value,
        transaction_date
    ) VALUES (
        text_concept_id,
        input_text_value,
        first_transaction_date_value
    );

    RETURN text_concept_id;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION add_name(
    input_concept_id UUID,
    language_id UUID,
    name_value TEXT
)
RETURNS VOID
AS $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;

    name_id UUID := GEN_RANDOM_UUID();
    text_id UUID;
BEGIN
    PERFORM add_first_concept(
        name_id,
        cid_name()
    );

    text_id := add_text(name_value);

    PERFORM add_original_relation(
        name_id,
        cid_linguistic_expression(),
        cid_language(),
        language_id
    );
    PERFORM add_text_relation(
        name_id,
        cid_linguistic_expression(),
        cid_text(),
        text_id
    );
    PERFORM add_original_relation(
        name_id,
        cid_signifier(),
        cid_concept(),
        input_concept_id
    );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION add_names(
    input_concept_id UUID,
    english_name_value TEXT,
    spanish_name_value TEXT
)
RETURNS VOID
AS $$
BEGIN
    PERFORM add_name(
        input_concept_id,
        cid_english_language(),
        english_name_value
    );
    PERFORM add_name(
        input_concept_id,
        cid_spanish_language(),
        spanish_name_value
    );
END;
$$ LANGUAGE plpgsql;


DO $$
DECLARE
    first_transaction_date_value TIMESTAMPTZ := '2024-09-18 00:00:00.000000+00'::TIMESTAMPTZ;
BEGIN

    PERFORM add_fundamental_concept(cid_datakoro_user());
    PERFORM add_fundamental_concept(cid_datakoro_first_user());
    INSERT INTO user_concept (
        concept_id,
        transaction_date,
        email,
        encrypted_password,
        is_admin,
        restricted_access,
        suspended_account
    ) VALUES (
        cid_datakoro_first_user(),
        first_transaction_date_value,
        'example@example.com',
        'password',
        TRUE,
        FALSE,
        FALSE
    );

    PERFORM add_fundamental_concept(cid_datakoro_operation());
    PERFORM add_fundamental_concept(cid_datakoro_first_operation());
    INSERT INTO operation_concept (
        concept_id,
        user_concept_id,
        start_date,
        end_date
    ) VALUES (
        cid_datakoro_first_operation(),
        cid_datakoro_first_user(),
        first_transaction_date_value,
        first_transaction_date_value
    );

    PERFORM add_fundamental_concept(cid_datakoro_transaction());
    PERFORM add_fundamental_concept(cid_datakoro_first_transaction());
    INSERT INTO transaction_concept (
        concept_id,
        operation_concept_id,
        transaction_date
    ) VALUES (
        cid_datakoro_first_transaction(),
        cid_datakoro_first_operation(),
        first_transaction_date_value
    );

    PERFORM add_fundamental_concept(cid_concept());
    PERFORM add_fundamental_concept(cid_abstraction());
    PERFORM add_fundamental_concept(cid_property());
    PERFORM add_fundamental_concept(cid_quality());

    PERFORM add_original_relation(
        cid_concept(),
        cid_abstraction(),
        cid_abstraction(),
        cid_concept()
    );
    PERFORM add_original_relation(
        cid_abstraction(),
        cid_abstraction(),
        cid_abstraction(),
        cid_abstraction()
    );
    PERFORM add_original_relation(
        cid_property(),
        cid_abstraction(),
        cid_abstraction(),
        cid_property()
    );
    PERFORM add_original_relation(
        cid_quality(),
        cid_abstraction(),
        cid_abstraction(),
        cid_quality()
    );
    PERFORM inherit_relations(
        cid_concept(),
        cid_abstraction()
    );
    PERFORM inherit_relations(
        cid_concept(),
        cid_property()
    );
    PERFORM inherit_relations(
        cid_concept(),
        cid_quality()
    );
    PERFORM inherit_relations(
        cid_abstraction(),
        cid_concept()
    );
    PERFORM inherit_relations(
        cid_property(),
        cid_concept()
    );
    PERFORM inherit_relations(
        cid_quality(),
        cid_concept()
    );

    PERFORM add_original_relation(
        cid_datakoro_operation(),
        cid_abstraction(),
        cid_abstraction(),
        cid_datakoro_operation()
    );
    PERFORM add_original_relation(
        cid_datakoro_first_operation(),
        cid_abstraction(),
        cid_abstraction(),
        cid_datakoro_first_operation()
    );
    PERFORM inherit_relations(
        cid_datakoro_operation(),
        cid_concept()
    );
    PERFORM inherit_relations(
        cid_datakoro_first_operation(),
        cid_datakoro_operation()
    );

    PERFORM add_original_relation(
        cid_datakoro_transaction(),
        cid_abstraction(),
        cid_abstraction(),
        cid_datakoro_transaction()
    );
    PERFORM add_original_relation(
        cid_datakoro_first_transaction(),
        cid_abstraction(),
        cid_abstraction(),
        cid_datakoro_first_transaction()
    );
    PERFORM inherit_relations(
        cid_datakoro_transaction(),
        cid_concept()
    );
    PERFORM inherit_relations(
        cid_datakoro_first_transaction(),
        cid_datakoro_transaction()
    );

    PERFORM add_original_relation(
        cid_datakoro_user(),
        cid_abstraction(),
        cid_abstraction(),
        cid_datakoro_user()
    );
    PERFORM add_original_relation(
        cid_datakoro_first_user(),
        cid_abstraction(),
        cid_abstraction(),
        cid_datakoro_first_user()
    );
    PERFORM inherit_relations(
        cid_datakoro_user(),
        cid_concept()
    );
    PERFORM inherit_relations(
        cid_datakoro_first_user(),
        cid_datakoro_user()
    );

    PERFORM add_first_concept(cid_datakoro_relation_rule(), cid_concept());
    PERFORM add_first_concept(cid_inactive_datakoro_relation_rule(), cid_datakoro_relation_rule());
    PERFORM add_first_concept(cid_datakoro_error(), cid_concept());
    PERFORM add_first_concept(cid_number(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_number(), cid_number());
    PERFORM add_first_concept(cid_text(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_text(), cid_text());
    PERFORM add_first_concept(cid_magnitude(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_magnitude(), cid_magnitude());
    PERFORM add_first_concept(cid_measurement_unit(), cid_concept());

    PERFORM add_relation_rule(
        cid_abstraction(),
        cid_abstraction(),
        NULL,
        FALSE,
        TRUE,
        TRUE
    );

    PERFORM add_first_concept(cid_datakoro_view(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_concept_view(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_abstraction_view(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_view_concept(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_login(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_view_datakoro_login(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_search(), cid_concept());
    PERFORM add_first_concept(cid_datakoro_view_datakoro_search(), cid_concept());

    /* --------------------------------------------- */

    PERFORM add_first_concept(cid_language(), cid_concept());

    PERFORM add_first_concept(cid_linguistic_expression(), cid_concept());

    PERFORM add_first_concept(cid_signifier(), cid_concept());
    PERFORM add_first_concept(cid_verbal_signifier(), cid_signifier());
    PERFORM inherit_relations(cid_verbal_signifier(), cid_linguistic_expression());

    PERFORM add_first_concept(cid_name(), cid_verbal_signifier());

    PERFORM add_first_concept(cid_english_language(), cid_language());
    PERFORM add_first_concept(cid_spanish_language(), cid_language());
    PERFORM add_first_concept(cid_japanese_language(), cid_language());
    PERFORM add_first_concept(cid_mandarin_chinese_language(), cid_language());
    PERFORM add_first_concept(cid_mekaranto_language(), cid_language());

    PERFORM add_relation_rule(
        cid_linguistic_expression(),
        cid_language(),
        1,
        TRUE,
        FALSE,
        TRUE
    );
    PERFORM add_relation_rule(
        cid_linguistic_expression(),
        cid_text(),
        NULL,
        FALSE,
        FALSE,
        TRUE
    );

    PERFORM add_relation_rule(
        cid_signifier(),
        cid_concept(),
        NULL,
        FALSE,
        FALSE,
        TRUE
    );

    PERFORM add_names(
        cid_concept(),
        'concept',
        'concepto'
    );
    PERFORM add_names(
        cid_abstraction(),
        'abstraction',
        'abstracción'
    );
    PERFORM add_names(
        cid_property(),
        'property',
        'propiedad'
    );
    PERFORM add_names(
        cid_quality(),
        'quality',
        'cualidad'
    );

    PERFORM add_names(
        cid_datakoro_operation(),
        'Datakoro operation',
        'operación de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_transaction(),
        'Datakoro transaction',
        'transacción de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_user(),
        'Datakoro user',
        'usuario de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_first_operation(),
        'Datakoro First Operation',
        'Primera Operación de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_first_transaction(),
        'Datakoro First Transaction',
        'Primera Transacción de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_first_user(),
        'Lajto',
        'Lajto'
    );

    PERFORM add_names(
        cid_datakoro_relation_rule(),
        'Datakoro relation rule',
        'regla para relaciones de Datakoro'
    );
    PERFORM add_names(
        cid_inactive_datakoro_relation_rule(),
        'Datakoro inactive relation rule',
        'regla inactiva para relaciones de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_error(),
        'Datakoro error',
        'error de Datakoro'
    );
    PERFORM add_names(
        cid_number(),
        'number',
        'número'
    );
    PERFORM add_names(
        cid_datakoro_number(),
        'Datakoro number',
        'número de Datakoro'
    );
    PERFORM add_names(
        cid_text(),
        'text',
        'texto'
    );
    PERFORM add_names(
        cid_datakoro_text(),
        'Datakoro text',
        'texto de Datakoro'
    );
    PERFORM add_names(
        cid_magnitude(),
        'magnitude',
        'magnitud'
    );
    PERFORM add_names(
        cid_datakoro_magnitude(),
        'Datakoro magnitude',
        'magnitud de Datakoro'
    );
    PERFORM add_names(
        cid_measurement_unit(),
        'measurement unit',
        'unidad de medida'
    );

    PERFORM add_names(
        cid_language(),
        'language',
        'idioma'
    );
    PERFORM add_names(
        cid_linguistic_expression(),
        'linguistic expression',
        'expresión lingüística'
    );
    PERFORM add_names(
        cid_signifier(),
        'signifier',
        'significante'
    );
    PERFORM add_names(
        cid_verbal_signifier(),
        'verbal signifier',
        'significante verbal'
    );
    PERFORM add_names(
        cid_name(),
        'name',
        'nombre'
    );

    PERFORM add_names(
        cid_english_language(),
        'English language',
        'idioma inglés'
    );
    PERFORM add_names(
        cid_spanish_language(),
        'Spanish language',
        'idioma español'
    );
    PERFORM add_names(
        cid_japanese_language(),
        'Japanese language',
        'idioma japonés'
    );
    PERFORM add_names(
        cid_mandarin_chinese_language(),
        'Mandarin Chinese language',
        'idioma chino mandarín'
    );
    PERFORM add_names(
        cid_mekaranto_language(),
        'Mekaranto',
        'mekaranto'
    );

    PERFORM add_names(
        cid_datakoro_view(),
        'Datakoro view',
        'vista de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_concept_view(),
        'Datakoro concept view',
        'vista de concepto de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_abstraction_view(),
        'Datakoro abstraction view',
        'vista de abstracción de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_login(),
        'Datakoro login',
        'Inicio de sesión de Datakoro'
    );
    PERFORM add_names(
        cid_datakoro_search(),
        'Datakoro search engine',
        'Buscador de Datakoro'
    );

END;
$$ LANGUAGE PLPGSQL;


DROP FUNCTION add_fundamental_concept(UUID);
DROP FUNCTION add_original_relation(UUID, UUID, UUID, UUID);
DROP FUNCTION add_text_relation(UUID, UUID, UUID, UUID);
DROP FUNCTION inherit_relations(UUID, UUID);
DROP FUNCTION add_first_concept(UUID, UUID);
DROP FUNCTION add_relation_rule(UUID, UUID, INT, BOOL, BOOL, BOOL);
DROP FUNCTION add_text(TEXT);
DROP FUNCTION add_name(UUID, UUID, TEXT);
DROP FUNCTION add_names(UUID, TEXT, TEXT);
