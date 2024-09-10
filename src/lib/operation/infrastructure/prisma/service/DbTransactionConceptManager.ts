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
    public static async findTransactionConceptById({
        transaction,
        conceptId,
    }: {
        transaction: DbTransaction;
        conceptId: ConceptId;
    }): Promise<TransactionConcept | null> {
        const criteria: TransactionConceptSearchCriteria = {
            filters: [
                {
                    field: TransactionConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: conceptId,
                    },
                },
            ],
        };
        const dbTransactionConcepts =
            await TransactionConceptSqlExecutor.select(
                transaction.prismaTx,
                criteria,
            );
        if (dbTransactionConcepts.length) {
            return null;
        }
        const dbTransactionConcept = dbTransactionConcepts[0];
        const transactionConcept = dbTransactionConcept.toDomain();
        return transactionConcept;
    }

    public static async findTransactionConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<TransactionConcept[]> {
        const criteria: TransactionConceptSearchCriteria = {
            filters: [
                {
                    field: TransactionConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: conceptIds,
                    },
                },
            ],
        };
        const dbTransactionConcepts =
            await TransactionConceptSqlExecutor.select(
                transaction.prismaTx,
                criteria,
            );
        const transactionConcepts = dbTransactionConcepts.map((c) =>
            c.toDomain(),
        );
        return transactionConcepts;
    }

    public static async getTransactionConceptById({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<TransactionConcept> {
        const transactionConcept =
            await DbTransactionConceptManager.findTransactionConceptById({
                conceptId: conceptId,
                transaction: transaction,
            });

        if (null == transactionConcept) {
            throw new TransactionConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        return transactionConcept;
    }

    public static async getTransactionConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<TransactionConcept[]> {
        const transactionConcepts =
            await DbTransactionConceptManager.findTransactionConceptsByIdInBulk(
                {
                    conceptIds: conceptIds,
                    transaction: transaction,
                },
            );

        if (conceptIds.length !== transactionConcepts.length) {
            const exceptions = [];
            const foundIdValues = transactionConcepts.map(
                (c) => c.id.shortValue,
            );
            for (const conceptId of conceptIds) {
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
