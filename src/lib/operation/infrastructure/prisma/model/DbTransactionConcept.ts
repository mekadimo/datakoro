import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { TransactionConceptFieldOrder } from "../../../domain/model/TransactionConcept";
import type { TransactionConceptFilter } from "../../../domain/model/TransactionConcept";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { TransactionConcept } from "../../../domain/model/TransactionConcept";
import { TransactionConceptDate } from "../../../domain/model/TransactionConceptDate";
import { TransactionConceptField } from "../../../domain/model/TransactionConcept";
import { TransactionConceptId } from "../../../domain/model/TransactionConcept";
import { TransactionConceptOperationId } from "../../../domain/model/TransactionConcept";

type DbTransactionConceptFilter =
    | { concept_id: DbUuidFilter }
    | { operation_concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter };

type DbTransactionConceptFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { operation_concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection };

export class DbTransactionConcept {
    concept_id: string;
    operation_concept_id: string;
    transaction_date: Date;

    constructor(input: {
        concept_id: string;
        operation_concept_id: string;
        transaction_date: Date;
    }) {
        this.concept_id = input.concept_id;
        this.operation_concept_id = input.operation_concept_id;
        this.transaction_date = input.transaction_date;
    }

    public static fromDomain(
        transactionConcept: TransactionConcept,
    ): DbTransactionConcept {
        return new DbTransactionConcept({
            concept_id: transactionConcept.id.longValue,
            operation_concept_id: transactionConcept.operationId.longValue,
            transaction_date: transactionConcept.date.value,
        });
    }

    public static toDbFilter(
        filter: TransactionConceptFilter,
    ): DbTransactionConceptFilter {
        switch (filter.field) {
            case TransactionConceptField.Date: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case TransactionConceptField.Id: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case TransactionConceptField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: TransactionConceptFilter[]): {
        AND: DbTransactionConceptFilter[];
    } {
        const dbFilters = filters.map((f) =>
            DbTransactionConcept.toDbFilter(f),
        );
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: TransactionConceptFieldOrder,
    ): DbTransactionConceptFieldOrder {
        switch (order.field) {
            case TransactionConceptField.Date: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case TransactionConceptField.Id: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case TransactionConceptField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: TransactionConceptFieldOrder[],
    ): DbTransactionConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbTransactionConcept.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): TransactionConcept {
        return new TransactionConcept({
            date: new TransactionConceptDate(this.transaction_date),
            id: new TransactionConceptId(this.concept_id),
            operationId: new TransactionConceptOperationId(
                this.operation_concept_id,
            ),
        });
    }
}
