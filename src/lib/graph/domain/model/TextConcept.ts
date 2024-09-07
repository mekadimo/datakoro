import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { TextFilter } from "../../../shared/domain/model/Filter";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { TextValueObject } from "../../../shared/domain/model/ValueObject";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";

export class TextConcept {
    readonly id: TextConceptId;
    readonly transactionDate: TextConceptTransactionDate;
    readonly value: TextConceptValue;

    constructor({
        id,
        transactionDate,
        value,
    }: {
        id: TextConceptId;
        transactionDate: TextConceptTransactionDate;
        value: TextConceptValue;
    }) {
        this.id = id;
        this.transactionDate = transactionDate;
        this.value = value;
    }

    public static create({
        conceptId,
        value,
        transactionConceptDate,
    }: {
        conceptId: ConceptId;
        value: TextConceptValue;
        transactionConceptDate: TransactionConceptDate;
    }): TextConcept {
        const id = new TextConceptId(conceptId.longValue);
        const transactionDate = new TextConceptTransactionDate(
            transactionConceptDate.value,
        );

        return new TextConcept({ id, transactionDate, value });
    }
}

export enum TextConceptField {
    Id = "TextConceptField.Id",
    TransactionDate = "TextConceptField.TransactionDate",
    Value = "TextConceptField.Value",
}

export type TextConceptFieldOrder = FieldOrder<TextConceptField>;

export type TextConceptFilter =
    | { field: TextConceptField.Id; filter: UuidFilter }
    | { field: TextConceptField.TransactionDate; filter: DateTimeFilter }
    | { field: TextConceptField.Value; filter: TextFilter };

export class TextConceptId extends ConceptId {}

export type TextConceptSearchCriteria = SearchCriteria<
    TextConceptFilter,
    TextConceptFieldOrder
>;

export class TextConceptTransactionDate extends TransactionConceptDate {}

export class TextConceptValue extends TextValueObject {}
