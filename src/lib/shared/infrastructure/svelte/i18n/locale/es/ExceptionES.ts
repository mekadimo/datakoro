import type { ExceptionKeys } from "../keys/ExceptionKeys";

export const ExceptionES: ExceptionKeys = {
    cannot_delete_inherited_relation:
        'La relación "{{relationId}}" no puede eliminarse, ya que es heredada.',
    concept_has_not_abstraction: "El concepto no tiene la abstracción.",
    concept_has_not_relation: "El concepto no tiene la relación.",
    concept_not_found: "Concepto no encontrado.",
    current_transaction_is_read_only:
        "La transacción actual es de solo lectura.",
    invalid_pagination_items_per_page:
        'El número "{{value}}" no es un parámetro válido de "elementos por página" para la paginación.',
    invalid_pagination_page_number:
        'El número "{{value}}" no es un parámetro válido de "número de página" para la paginación.',
    invalid_positive_integer_exception:
        'El número "{{value}}" no es un entero positivo.',
    invalid_positive_non_zero_integer_exception:
        'El número "{{value}}" no es un entero positivo distinto de cero.',
    invalid_uuid: 'El valor "{{value}}" no es una UUID válida.',
    language_code_not_supported:
        'El código de idioma "{{languageCode}}" no está soportado.',
    magnitude_concept_not_found: "Concepto de magnitud no encontrado.",
    number_concept_not_found: "Concepto de número no encontrado.",
    operation_concept_not_found: "Concepto de operación no encontrado.",
    relation_not_found: "Relación no encontrada.",
    relation_order_cannot_be_changed: "Relation order cannot be changed.",
    relation_rule_not_found: "Regla de relación no encontrada.",
    text_concept_not_found: "Concepto de texto no encontrado.",
    transaction_concept_not_found: "Concepto de transacción no encontrado.",
    unexpected_database_error: "Error inesperado en la base de datos.",
    unknown_error: "Error desconocido.",
    user_concept_not_found: "Concepto de usuario no encontrado.",
    user_not_logged_in: "Usuario no conectado.",
    user_session_not_found: "Sesión de usuario no encontrada.",
};
