import type { ConceptFieldOrder } from "../../../domain/model/Concept";
import type { ConceptFilter } from "../../../domain/model/Concept";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import { Concept } from "../../../domain/model/Concept";
import { ConceptField } from "../../../domain/model/Concept";
import { ConceptId } from "../../../domain/model/ConceptId";
import { ConceptOperationId } from "../../../domain/model/Concept";
import { ConceptTransactionDate } from "../../../domain/model/Concept";
import { ConceptTransactionId } from "../../../domain/model/Concept";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";

type DbConceptFilter =
    | { id: DbUuidFilter }
    | { operation_concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter }
    | { transaction_concept_id: DbUuidFilter };

type DbConceptFieldOrder =
    | { id: DbFieldOrderDirection }
    | { operation_concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection }
    | { transaction_concept_id: DbFieldOrderDirection };

export class DbConcept {
    id: string;
    operation_concept_id: string;
    transaction_date: Date;
    transaction_concept_id: string;

    constructor({
        id,
        operation_concept_id,
        transaction_date,
        transaction_concept_id,
    }: {
        id: string;
        operation_concept_id: string;
        transaction_date: Date;
        transaction_concept_id: string;
    }) {
        this.id = id;
        this.operation_concept_id = operation_concept_id;
        this.transaction_date = transaction_date;
        this.transaction_concept_id = transaction_concept_id;
    }

    public static fromDomain(concept: Concept): DbConcept {
        return new DbConcept({
            id: concept.id.longValue,
            operation_concept_id: concept.operationId.longValue,
            transaction_date: concept.transactionDate.value,
            transaction_concept_id: concept.transactionId.longValue,
        });
    }

    public static toDbFilter(filter: ConceptFilter): DbConceptFilter {
        switch (filter.field) {
            case ConceptField.Id: {
                return { id: DbModel.toDbUuidFilter(filter.filter) };
            }
            case ConceptField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case ConceptField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: ConceptFilter[]): {
        AND: DbConceptFilter[];
    } {
        const dbFilters = filters.map((f) => DbConcept.toDbFilter(f));
        return { AND: dbFilters };
    }

    public static toDbOrder(order: ConceptFieldOrder): DbConceptFieldOrder {
        switch (order.field) {
            case ConceptField.Id: {
                return { id: DbModel.toDbOrderDirection(order.direction) };
            }
            case ConceptField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ConceptField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: ConceptFieldOrder[],
    ): DbConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbConcept.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): Concept {
        return new Concept({
            id: new ConceptId(this.id),
            operationId: new ConceptOperationId(this.operation_concept_id),
            transactionDate: new ConceptTransactionDate(this.transaction_date),
            transactionId: new ConceptTransactionId(
                this.transaction_concept_id,
            ),
        });
    }
}
