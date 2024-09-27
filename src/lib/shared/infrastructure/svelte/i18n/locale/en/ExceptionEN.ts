import type { ExceptionKeys } from "../keys/ExceptionKeys";

export const ExceptionEN: ExceptionKeys = {
    cannot_delete_inherited_relation:
        'The relation "{{relationId}}" cannot be deleted, since it\'s inherited.',
    concept_has_not_abstraction: "Concept has not abstraction.",
    concept_has_not_relation: "Concept has not relation.",
    concept_not_found: "Concept not found.",
    current_transaction_is_read_only: "Current transaction is read only.",
    invalid_pagination_items_per_page:
        'The number "{{value}}" is not a valid "items per page" parameter for pagination.',
    invalid_pagination_page_number:
        'The number "{{value}}" is not a valid "number page" parameter for pagination.',
    invalid_positive_integer_exception:
        'The number "{{value}}" is not a positive integer.',
    invalid_positive_non_zero_integer_exception:
        'The number "{{value}}" is not a non zero positive integer.',
    invalid_uuid: 'The value "{{value}}" is not a valid UUID.',
    language_code_not_supported:
        'The language code "{{languageCode}}" is not supported.',
    magnitude_concept_not_found: "Magnitude concept not found.",
    number_concept_not_found: "Number concept not found.",
    operation_concept_not_found: "Operation concept not found.",
    relation_not_found: "Relation not found.",
    relation_order_cannot_be_changed: "Relation order cannot be changed.",
    relation_rule_not_found: "Relation rule not found.",
    text_concept_not_found: "Text concept not found.",
    transaction_concept_not_found: "Transaction concept not found.",
    unexpected_database_error: "Unexpected error on database.",
    unknown_error: "Unexpected error.",
    user_concept_not_found: "User concept not found.",
    user_not_logged_in: "User not logged in.",
    user_session_not_found: "User session not found.",
};
