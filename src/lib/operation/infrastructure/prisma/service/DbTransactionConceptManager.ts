import type { ConceptId } from "../../../../graph/domain/model/ConceptId";
import type { DbTransaction } from "../model/DbTransaction";
import type { TransactionConceptSearchCriteria } from "../../../domain/model/TransactionConcept";
import { TransactionConcept } from "../../../domain/model/TransactionConcept";
import { TransactionConceptField } from "../../../domain/model/TransactionConcept";
import { TransactionConceptNotFoundException } from "../../../../shared/domain/model/DomainException";
import { TransactionConceptSqlExecutor } from "../statement/TransactionConceptSqlExecutor";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbTransactionConceptManager {
    public static async findTransactionConceptById(input: {
        transaction: DbTransaction;
        conceptId: ConceptId;
    }): Promise<TransactionConcept | null> {
        const criteria: TransactionConceptSearchCriteria = {
            filters: [
                {
                    field: TransactionConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.conceptId,
                    },
                },
            ],
        };
        const dbTransactionConcepts =
            await TransactionConceptSqlExecutor.select(
                input.transaction.prismaTx,
                criteria,
            );
        if (dbTransactionConcepts.length) {
            return null;
        }
        const dbTransactionConcept = dbTransactionConcepts[0];
        const transactionConcept = dbTransactionConcept.toDomain();
        return transactionConcept;
    }

    public static async findTransactionConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<TransactionConcept[]> {
        const criteria: TransactionConceptSearchCriteria = {
            filters: [
                {
                    field: TransactionConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.conceptIds,
                    },
                },
            ],
        };
        const dbTransactionConcepts =
            await TransactionConceptSqlExecutor.select(
                input.transaction.prismaTx,
                criteria,
            );
        const transactionConcepts = dbTransactionConcepts.map((c) =>
            c.toDomain(),
        );
        return transactionConcepts;
    }

    public static async getTransactionConceptById(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<TransactionConcept> {
        const transactionConcept =
            await DbTransactionConceptManager.findTransactionConceptById({
                conceptId: input.conceptId,
                transaction: input.transaction,
            });

        if (null == transactionConcept) {
            throw new TransactionConceptNotFoundException({
                id: input.conceptId.shortValue,
            });
        }

        return transactionConcept;
    }

    public static async getTransactionConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<TransactionConcept[]> {
        const transactionConcepts =
            await DbTransactionConceptManager.findTransactionConceptsByIdInBulk(
                {
                    conceptIds: input.conceptIds,
                    transaction: input.transaction,
                },
            );

        if (input.conceptIds.length !== transactionConcepts.length) {
            const exceptions = [];
            const foundIdValues = transactionConcepts.map(
                (c) => c.id.shortValue,
            );
            for (const conceptId of input.conceptIds) {
                if (foundIdValues.includes(conceptId.shortValue)) {
                    continue;
                }
                const exception = new TransactionConceptNotFoundException({
                    id: conceptId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return transactionConcepts;
    }
}
