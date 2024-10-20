import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { DecimalNumberFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { DecimalNumberValueObject } from "../../../shared/domain/model/ValueObject";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";

export class NumberConcept {
    readonly id: NumberConceptId;
    readonly transactionDate: NumberConceptTransactionDate;
    readonly value: NumberConceptValue;

    constructor(input: {
        id: NumberConceptId;
        transactionDate: NumberConceptTransactionDate;
        value: NumberConceptValue;
    }) {
        this.id = input.id;
        this.transactionDate = input.transactionDate;
        this.value = input.value;
    }

    public static create(input: {
        conceptId: ConceptId;
        value: NumberConceptValue;
        transactionConceptDate: TransactionConceptDate;
    }): NumberConcept {
        const id = new NumberConceptId(input.conceptId.longValue);
        const transactionDate = new NumberConceptTransactionDate(
            input.transactionConceptDate.value,
        );

        return new NumberConcept({ id, transactionDate, value: input.value });
    }
}

export enum NumberConceptField {
    Id = "NumberConceptField.Id",
    TransactionDate = "NumberConceptField.TransactionDate",
    Value = "NumberConceptField.Value",
}

export type NumberConceptFieldOrder = FieldOrder<NumberConceptField>;

export type NumberConceptFilter =
    | { field: NumberConceptField.Id; filter: UuidFilter }
    | { field: NumberConceptField.TransactionDate; filter: DateTimeFilter }
    | { field: NumberConceptField.Value; filter: DecimalNumberFilter };

export class NumberConceptId extends ConceptId {}

export type NumberConceptSearchCriteria = SearchCriteria<
    NumberConceptFilter,
    NumberConceptFieldOrder
>;

export class NumberConceptTransactionDate extends TransactionConceptDate {}

export class NumberConceptValue extends DecimalNumberValueObject {}
