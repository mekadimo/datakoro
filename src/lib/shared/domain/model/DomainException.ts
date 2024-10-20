import type Decimal from "decimal.js";

export enum DomainExceptionCode {
    CANNOT_DELETE_INHERITED_RELATION = "cannot_delete_inherited_relation",
    CONCEPT_HAS_NOT_ABSTRACTION = "concept_has_not_abstraction",
    CONCEPT_HAS_NOT_RELATION = "concept_has_not_relation",
    CONCEPT_NOT_FOUND = "concept_not_found",
    CURRENT_TRANSACTION_IS_READ_ONLY = "current_transaction_is_read_only",
    INVALID_PAGINATION_ITEMS_PER_PAGE = "invalid_pagination_items_per_page",
    INVALID_PAGINATION_PAGE_NUMBER = "invalid_pagination_page_number",
    INVALID_POSITIVE_INTEGER_EXCEPTION = "invalid_positive_integer_exception",
    INVALID_POSITIVE_NON_ZERO_INTEGER_EXCEPTION = "invalid_positive_non_zero_integer_exception",
    INVALID_UUID = "invalid_uuid",
    LANGUAGE_CODE_NOT_SUPPORTED = "language_code_not_supported",
    MAGNITUDE_CONCEPT_NOT_FOUND = "magnitude_concept_not_found",
    NUMBER_CONCEPT_NOT_FOUND = "number_concept_not_found",
    OPERATION_CONCEPT_NOT_FOUND = "operation_concept_not_found",
    RELATION_NOT_FOUND = "relation_not_found",
    RELATION_ORDER_CANNOT_BE_CHANGED = "relation_order_cannot_be_changed",
    RELATION_RULE_NOT_FOUND = "relation_rule_not_found",
    TEXT_CONCEPT_NOT_FOUND = "text_concept_not_found",
    TRANSACTION_CONCEPT_NOT_FOUND = "transaction_concept_not_found",
    UNEXPECTED_DATABASE_ERROR = "unexpected_database_error",
    UNKNOWN_ERROR = "unknown_error",
    USER_CONCEPT_NOT_FOUND = "user_concept_not_found",
    USER_NOT_LOGGED_IN = "user_not_logged_in",
    USER_SESSION_NOT_FOUND = "user_session_not_found",
}

interface DomainExceptionContext {
    // TODO: Use value objects where possible, and convert properly
    // to string for i18nContext.
    [key: string]:
        | Decimal
        | Decimal[]
        | bigint
        | bigint[]
        | boolean
        | null
        | number
        | number[]
        | string
        | string[];
}

interface DomainExceptionI18nContext {
    [key: string]: string;
}

export abstract class DomainException {
    public readonly code: DomainExceptionCode;
    public readonly context: DomainExceptionContext;
    public readonly i18nKey: string;
    public readonly i18nContext: DomainExceptionI18nContext;

    constructor(input: {
        code: DomainExceptionCode;
        context?: DomainExceptionContext;
    }) {
        this.code = input.code;
        this.i18nKey = "exception." + input.code;
        this.context = Object.freeze(input.context ?? {});

        const i18nContext: DomainExceptionI18nContext = {};
        for (const key in input.context) {
            i18nContext[key] = input.context[key]?.toString() ?? "null";
        }
        this.i18nContext = Object.freeze(i18nContext);
    }
}

export class CannotDeleteInheritedRelationException extends DomainException {
    constructor(context: { relationId: string }) {
        super({
            code: DomainExceptionCode.CANNOT_DELETE_INHERITED_RELATION,
            context: context,
        });
    }
}

export class ConceptHasNotAbstractionException extends DomainException {
    constructor(context: { abstractionId: string; conceptId: string }) {
        super({
            code: DomainExceptionCode.CONCEPT_HAS_NOT_ABSTRACTION,
            context: context,
        });
    }
}

export class ConceptHasNotRelationException extends DomainException {
    constructor(context: {
        abstractionId: string;
        conceptId: string;
        orderNumber: bigint | null;
        propertyId: string;
        qualityId: string;
    }) {
        super({
            code: DomainExceptionCode.CONCEPT_HAS_NOT_RELATION,
            context: context,
        });
    }
}

export class ConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({
            code: DomainExceptionCode.CONCEPT_NOT_FOUND,
            context: context,
        });
    }
}

export class CurrentTransactionIsReadOnlyException extends DomainException {
    constructor() {
        super({ code: DomainExceptionCode.CURRENT_TRANSACTION_IS_READ_ONLY });
    }
}

export class InvalidPaginationItemsPerPageException extends DomainException {
    constructor(context: { value: number }) {
        super({
            code: DomainExceptionCode.INVALID_PAGINATION_ITEMS_PER_PAGE,
            context: context,
        });
    }
}

export class InvalidPaginationPageNumberException extends DomainException {
    constructor(context: { value: number }) {
        super({
            code: DomainExceptionCode.INVALID_PAGINATION_PAGE_NUMBER,
            context: context,
        });
    }
}

export class InvalidPositiveIntegerException extends DomainException {
    constructor(context: { value: string }) {
        super({
            code: DomainExceptionCode.INVALID_POSITIVE_INTEGER_EXCEPTION,
            context: context,
        });
    }
}

export class InvalidPositiveNonZeroIntegerException extends DomainException {
    constructor(context: { value: string }) {
        super({
            code: DomainExceptionCode.INVALID_POSITIVE_NON_ZERO_INTEGER_EXCEPTION,
            context: context,
        });
    }
}

export class InvalidUuidException extends DomainException {
    constructor(context: { value: string }) {
        super({ code: DomainExceptionCode.INVALID_UUID, context: context });
    }
}

export class LanguageCodeNotSupportedException extends DomainException {
    constructor(context: { languageCode: string }) {
        super({
            code: DomainExceptionCode.LANGUAGE_CODE_NOT_SUPPORTED,
            context: context,
        });
    }
}

export class MagnitudeConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({
            code: DomainExceptionCode.MAGNITUDE_CONCEPT_NOT_FOUND,
            context: context,
        });
    }
}

export class NumberConceptNotFoundException extends DomainException {
    constructor(context: { id: string } | { value: Decimal }) {
        super({
            code: DomainExceptionCode.NUMBER_CONCEPT_NOT_FOUND,
            context: context,
        });
    }
}

export class OperationConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({
            code: DomainExceptionCode.OPERATION_CONCEPT_NOT_FOUND,
            context: context,
        });
    }
}

export class RelationNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({
            code: DomainExceptionCode.RELATION_NOT_FOUND,
            context: context,
        });
    }
}

export class RelationOrderCannotBeChangedException extends DomainException {
    constructor(context: { relationId: string; relationIsOriginal: boolean }) {
        super({
            code: DomainExceptionCode.RELATION_ORDER_CANNOT_BE_CHANGED,
            context: context,
        });
    }
}

export class RelationRuleNotFoundException extends DomainException {
    constructor(
        context:
            | { relationRuleId: string }
            | { conceptId: string }
            | {
                  abstractionId: string;
                  propertyId: string;
              },
    ) {
        super({
            code: DomainExceptionCode.RELATION_RULE_NOT_FOUND,
            context: context,
        });
    }
}

export class TextConceptNotFoundException extends DomainException {
    constructor(context: { id: string } | { value: string }) {
        super({
            code: DomainExceptionCode.TEXT_CONCEPT_NOT_FOUND,
            context: context,
        });
    }
}

export class TransactionConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({
            code: DomainExceptionCode.TRANSACTION_CONCEPT_NOT_FOUND,
            context: context,
        });
    }
}

export class UnexpectedDatabaseErrorException extends DomainException {
    constructor() {
        super({ code: DomainExceptionCode.UNEXPECTED_DATABASE_ERROR });
    }
}

export class UnknownErrorException extends DomainException {
    constructor() {
        super({ code: DomainExceptionCode.UNKNOWN_ERROR });
    }
}

export class UserConceptNotFoundException extends DomainException {
    constructor(context: { id: string } | { email: string }) {
        super({
            code: DomainExceptionCode.USER_CONCEPT_NOT_FOUND,
            context: context,
        });
    }
}

export class UserNotLoggedInException extends DomainException {
    constructor() {
        super({ code: DomainExceptionCode.USER_NOT_LOGGED_IN });
    }
}

export class UserSessionNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({
            code: DomainExceptionCode.USER_SESSION_NOT_FOUND,
            context: context,
        });
    }
}
