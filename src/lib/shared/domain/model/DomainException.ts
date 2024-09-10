import type Decimal from "decimal.js";

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
    public readonly code: string;
    public readonly context: DomainExceptionContext;
    public readonly i18nKey: string;
    public readonly i18nContext: DomainExceptionI18nContext;

    constructor({
        code,
        context,
    }: {
        code: string;
        context?: DomainExceptionContext;
    }) {
        this.code = code;
        this.i18nKey = "exception." + code;
        this.context = Object.freeze(context ?? {});

        const i18nContext: DomainExceptionI18nContext = {};
        for (const key in context) {
            i18nContext[key] = context[key]?.toString() ?? "null";
        }
        this.i18nContext = Object.freeze(i18nContext);
    }
}

export class CannotDeleteInheritedRelationException extends DomainException {
    constructor(context: { relationId: string }) {
        super({ code: "cannot_delete_inherited_relation", context: context });
    }
}

export class ConceptHasNotAbstractionException extends DomainException {
    constructor(context: { abstractionId: string; conceptId: string }) {
        super({ code: "concept_has_not_abstraction", context: context });
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
        super({ code: "concept_has_not_relation", context: context });
    }
}

export class ConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({ code: "concept_not_found", context: context });
    }
}

export class CurrentTransactionIsReadOnlyException extends DomainException {
    constructor() {
        super({ code: "current_transaction_is_read_only" });
    }
}

export class InvalidPaginationItemsPerPageException extends DomainException {
    constructor(context: { value: number }) {
        super({ code: "invalid_pagination_items_per_page", context: context });
    }
}

export class InvalidPaginationPageNumberException extends DomainException {
    constructor(context: { value: number }) {
        super({ code: "invalid_pagination_page_number", context: context });
    }
}

export class InvalidPositiveIntegerException extends DomainException {
    constructor(context: { value: string }) {
        super({ code: "invalid_positive_integer_exception", context: context });
    }
}

export class InvalidPositiveNonZeroIntegerException extends DomainException {
    constructor(context: { value: string }) {
        super({
            code: "invalid_positive_non_zero_integer_exception",
            context: context,
        });
    }
}

export class InvalidUuidException extends DomainException {
    constructor(context: { value: string }) {
        super({ code: "invalid_uuid", context: context });
    }
}

export class MagnitudeConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({ code: "magnitude_concept_not_found", context: context });
    }
}

export class NumberConceptNotFoundException extends DomainException {
    constructor(context: { id: string } | { value: Decimal }) {
        super({ code: "number_concept_not_found", context: context });
    }
}

export class OperationConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({ code: "operation_concept_not_found", context: context });
    }
}

export class RelationNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({ code: "relation_not_found", context: context });
    }
}

export class RelationOrderCannotBeChangedException extends DomainException {
    constructor(context: { relationId: string; relationIsOriginal: boolean }) {
        super({ code: "relation_order_cannot_be_changed", context: context });
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
        super({ code: "relation_rule_not_found", context: context });
    }
}

export class TextConceptNotFoundException extends DomainException {
    constructor(context: { id: string } | { value: string }) {
        super({ code: "text_concept_not_found", context: context });
    }
}

export class TransactionConceptNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({ code: "transaction_concept_not_found", context: context });
    }
}

export class UnexpectedDatabaseErrorException extends DomainException {
    constructor() {
        super({ code: "unexpected_database_error" });
    }
}

export class UnknownErrorException extends DomainException {
    constructor() {
        super({ code: "unknown_error" });
    }
}

export class UserConceptNotFoundException extends DomainException {
    constructor(context: { id: string } | { email: string }) {
        super({ code: "user_concept_not_found", context: context });
    }
}

export class UserNotLoggedInException extends DomainException {
    constructor() {
        super({ code: "user_not_logged_in" });
    }
}

export class UserSessionNotFoundException extends DomainException {
    constructor(context: { id: string }) {
        super({ code: "user_session_not_found", context: context });
    }
}
