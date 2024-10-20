import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { OperationConceptId } from "./OperationConcept";
import { TransactionConceptDate } from "./TransactionConceptDate";
import { UuidValueObject } from "../../../shared/domain/model/ValueObject";

export class TransactionConcept {
    readonly date: TransactionConceptDate;
    readonly id: TransactionConceptId;
    readonly operationId: TransactionConceptOperationId;

    constructor(input: {
        date: TransactionConceptDate;
        id: TransactionConceptId;
        operationId: TransactionConceptOperationId;
    }) {
        this.id = input.id;
        this.date = input.date;
        this.operationId = input.operationId;
    }

    public static create(input: {
        conceptId: ConceptId;
        operationConceptId: OperationConceptId;
        transactionConceptDate: TransactionConceptDate;
    }): TransactionConcept {
        const id = new TransactionConceptId(input.conceptId.longValue);
        const date = new TransactionConceptDate(
            input.transactionConceptDate.value,
        );
        const operationId = new TransactionConceptOperationId(
            input.operationConceptId.longValue,
        );

        return new TransactionConcept({ date, id, operationId });
    }
}

export enum TransactionConceptField {
    Date = "TransactionConceptField.Date",
    Id = "TransactionConceptField.Id",
    OperationId = "TransactionConceptField.OperationId",
}

export type TransactionConceptFieldOrder = FieldOrder<TransactionConceptField>;

export type TransactionConceptFilter =
    | { field: TransactionConceptField.Date; filter: DateTimeFilter }
    | { field: TransactionConceptField.Id; filter: UuidFilter }
    | { field: TransactionConceptField.OperationId; filter: UuidFilter };

export class TransactionConceptId extends ConceptId {
    public static generateRandom(): TransactionConceptId {
        const randomValue = UuidValueObject.generateRandomValue();
        return new TransactionConceptId(randomValue);
    }
}

export type TransactionConceptSearchCriteria = SearchCriteria<
    TransactionConceptFilter,
    TransactionConceptFieldOrder
>;

export class TransactionConceptOperationId extends OperationConceptId {}
