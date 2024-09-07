import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { ConceptId } from "./ConceptId";
import { OperationConceptId } from "../../../operation/domain/model/OperationConcept";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";
import { TransactionConceptId } from "../../../operation/domain/model/TransactionConcept";

export class Concept {
    readonly id: ConceptId;
    readonly operationId: ConceptOperationId;
    readonly transactionDate: ConceptTransactionDate;
    readonly transactionId: ConceptTransactionId;

    constructor({
        id,
        operationId,
        transactionDate,
        transactionId,
    }: {
        id: ConceptId;
        operationId: ConceptOperationId;
        transactionDate: ConceptTransactionDate;
        transactionId: ConceptTransactionId;
    }) {
        this.id = id;
        this.operationId = operationId;
        this.transactionDate = transactionDate;
        this.transactionId = transactionId;
    }

    public static create({
        conceptId,
        operationConceptId,
        transactionConceptId,
        transactionConceptDate,
    }: {
        conceptId: ConceptId;
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
    }): Concept {
        const id = new ConceptId(conceptId.longValue);
        const operationId = new ConceptOperationId(
            operationConceptId.longValue,
        );
        const transactionId = new ConceptTransactionId(
            transactionConceptId.longValue,
        );
        const transactionDate = new ConceptTransactionDate(
            transactionConceptDate.value,
        );

        return new Concept({
            id,
            operationId,
            transactionDate,
            transactionId,
        });
    }
}

export enum ConceptField {
    Id = "ConceptField.Id",
    OperationId = "ConceptField.OperationId",
    TransactionDate = "ConceptField.TransactionDate",
    TransactionId = "ConceptField.TransactionId",
}

export type ConceptFieldOrder = FieldOrder<ConceptField>;

export type ConceptFilter =
    | { field: ConceptField.Id; filter: UuidFilter }
    | { field: ConceptField.OperationId; filter: UuidFilter }
    | { field: ConceptField.TransactionDate; filter: DateTimeFilter }
    | { field: ConceptField.TransactionId; filter: UuidFilter };

export class ConceptOperationId extends OperationConceptId {}

export class ConceptTransactionDate extends TransactionConceptDate {}

export class ConceptTransactionId extends TransactionConceptId {}

export type ConceptSearchCriteria = SearchCriteria<
    ConceptFilter,
    ConceptFieldOrder
>;
