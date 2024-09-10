
CREATE OR REPLACE FUNCTION cid_datakoro_operation()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '111AB302D6A64E7999C9C87242D91056'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_transaction()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '4ADD74548D2D46609D6B770816889501'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_user()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'ECB2E0C4270340BAB8730DB1E46C02B4'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_first_operation()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '00000000000000000000000000000000'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_first_transaction()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '387A210178DE4FCE8F454B878EE49D0F'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_first_user()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '3424E850A3A142B3A67F870FBA7B43A6'::UUID
$$;


/*---------------------------------------------------------------------------*/


CREATE OR REPLACE FUNCTION cid_concept()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'CC915020DD1E4F78B94F95D9A271179E'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_abstraction()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '437857FFE7E7497592445C465E177804'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_property()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '8A764E33677F44B494082EA3826D4B3B'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_quality()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'E88775D4853448309F09F29B638675B4'::UUID
$$;


/*---------------------------------------------------------------------------*/


CREATE OR REPLACE FUNCTION cid_datakoro_relation_rule()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'C03837EC7045430F89C16E16E3312C72'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_inactive_datakoro_relation_rule()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '3E58F57C5FEE471E89D7238A34C344B6'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_error()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '7F8913ED40F24958811EF232C8D7B493'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_number()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '21E9B2D9958B418094BBB569A023D1DC'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_number()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '729A3344C79B4B78A9805CEC853FA0D6'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_text()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '95645A4F87AA4B438B0B10D012EE8E67'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_text()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'F92F08F600024D09830579DC97C386FF'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_magnitude()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'CAB50FF3A47841A8A2AADC2F1647AADB'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_magnitude()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '8F85100223B8419F88F887887C64DC73'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_measurement_unit()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '73494F98F7BA475BA04EB7EAC5B65269'::UUID
$$;


/*---------------------------------------------------------------------------*/


CREATE OR REPLACE FUNCTION cid_language()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '4FC8F487C7444EBA855C815BD5E214E4'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_linguistic_expression()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '13240A49995E4521AD822050802D19C6'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_signifier()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '3DC558EF6F664C53BC755E8AF9FF6D4A'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_verbal_signifier()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'D4DFEDDFF48C4634B63E445417BF7289'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_name()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '4460969858484C64A109960D67F5C925'::UUID
$$;


/*---------------------------------------------------------------------------*/


CREATE OR REPLACE FUNCTION cid_english_language()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '0D781D564AF94BC39719324164963DC1'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_spanish_language()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '6142064F5D57488C8AB9B3FC6FACC0A4'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_japanese_language()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '6FBC341EEE38495FBA63020BC12A1ADB'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_mandarin_chinese_language()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '1BAD39FB73CF466FB536AC846DECACA6'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_mekaranto_language()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '763BDAB612C74DB9A1302AFD30760C57'::UUID
$$;


/*---------------------------------------------------------------------------*/

CREATE OR REPLACE FUNCTION cid_datakoro_view()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '5b99ec7e-e54c-4ae1-bef5-b79852a2b062'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_concept_view()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'e84b8135-d45a-4245-ad38-faec049c4afe'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_abstraction_view()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '6700e6eb-268a-44a2-8a5b-58faaff4e50a'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_view_concept()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '9c50d80f-0766-4bbd-96a5-1c9de4159f34'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_login()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'a656665c-8fc7-4f21-acac-bf8d3164fae4'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_view_datakoro_login()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT '0fe917b1-6bcc-4d92-88df-d6182ed19404'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_search()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'c5beeb7a-13d7-4d46-a401-09ffb857cb36'::UUID
$$;

CREATE OR REPLACE FUNCTION cid_datakoro_view_datakoro_search()
RETURNS UUID LANGUAGE SQL IMMUTABLE PARALLEL SAFE
AS $$
    SELECT 'fdcfba6b-ae29-4a41-98dc-3fe5a8dd5b73'::UUID
$$;
