import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { Decimal } from "decimal.js/decimal";
import type { DecimalNumberIntervalFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";
import { ValueObjectSingleValue } from "../../../shared/domain/model/ValueObject";

export class MagnitudeConcept {
    readonly id: MagnitudeConceptId;
    readonly interval: MagnitudeConceptInterval;
    readonly magnitudeId: MagnitudeConceptMagnitudeId;
    readonly transactionDate: MagnitudeConceptTransactionDate;

    constructor({
        id,
        interval,
        magnitudeId,
        transactionDate,
    }: {
        id: MagnitudeConceptId;
        interval: MagnitudeConceptInterval;
        magnitudeId: MagnitudeConceptMagnitudeId;
        transactionDate: MagnitudeConceptTransactionDate;
    }) {
        this.id = id;
        this.interval = interval;
        this.magnitudeId = magnitudeId;
        this.transactionDate = transactionDate;
    }

    public static create(
        conceptId: ConceptId,
        conceptMagnitudeId: ConceptId,
        interval: MagnitudeConceptInterval,
        transactionConceptDate: TransactionConceptDate,
    ): MagnitudeConcept {
        const id = new MagnitudeConceptId(conceptId.longValue);
        const magnitudeId = new MagnitudeConceptMagnitudeId(
            conceptMagnitudeId.longValue,
        );
        const transactionDate = new MagnitudeConceptTransactionDate(
            transactionConceptDate.value,
        );

        return new MagnitudeConcept({
            id,
            interval,
            magnitudeId,
            transactionDate,
        });
    }
}

export enum MagnitudeConceptField {
    Id = "MagnitudeConceptField.Id",
    Interval = "MagnitudeConceptField.Interval",
    MagnitudeId = "MagnitudeConceptField.MagnitudeId",
    TransactionDate = "MagnitudeConceptField.TransactionDate",
}

export type MagnitudeConceptFieldOrder = FieldOrder<MagnitudeConceptField>;

export type MagnitudeConceptFilter =
    | { field: MagnitudeConceptField.Id; filter: UuidFilter }
    | {
          field: MagnitudeConceptField.Interval;
          filter: DecimalNumberIntervalFilter;
      }
    | { field: MagnitudeConceptField.MagnitudeId; filter: UuidFilter }
    | { field: MagnitudeConceptField.TransactionDate; filter: DateTimeFilter };

export class MagnitudeConceptId extends ConceptId {}

export class MagnitudeConceptMagnitudeId extends ConceptId {}

export type MagnitudeConceptSearchCriteria = SearchCriteria<
    MagnitudeConceptFilter,
    MagnitudeConceptFieldOrder
>;

export class MagnitudeConceptTransactionDate extends TransactionConceptDate {}

export class MagnitudeConceptInterval extends ValueObjectSingleValue<
    [Decimal | null, Decimal | null]
> {}
