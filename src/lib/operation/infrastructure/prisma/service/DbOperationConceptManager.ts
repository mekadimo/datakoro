import type { ConceptId } from "../../../../graph/domain/model/ConceptId";
import type { DbTransaction } from "../../../../shared/infrastructure/prisma/model/DbTransaction";
import type { OperationConceptSearchCriteria } from "../../../domain/model/OperationConcept";
import { DbGraphManager } from "../../../../graph/infrastructure/prisma/service/DbGraphManager";
import { DbOperationConcept } from "../model/DbOperationConcept";
import { ID_DATAKORO_OPERATION } from "../../../../graph/domain/model/ConceptId";
import { OperationConcept } from "../../../domain/model/OperationConcept";
import { OperationConceptField } from "../../../domain/model/OperationConcept";
import { OperationConceptNotFoundException } from "../../../../shared/domain/model/DomainException";
import { OperationConceptSqlExecutor } from "../statement/OperationConceptSqlExecutor";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbOperationConceptManager {
    public static async addOperationConcept({
        transaction,
    }: {
        transaction: DbTransaction;
    }): Promise<OperationConcept> {
        await DbGraphManager.addConcept({
            transaction: transaction,
            conceptId: transaction.currentOperationConceptId,
            abstractionId: ID_DATAKORO_OPERATION,
        });

        const operationConcept = OperationConcept.create({
            conceptId: transaction.currentOperationConceptId,
            userConceptId: transaction.currentUserId,
            transactionConceptDate: transaction.currentTransactionConceptDate,
        });

        const dbOperationConcept =
            DbOperationConcept.fromDomain(operationConcept);
        await OperationConceptSqlExecutor.insert(
            transaction.prismaTx,
            dbOperationConcept,
        );

        return operationConcept;
    }

    public static async findOperationConceptById({
        transaction,
        conceptId,
    }: {
        transaction: DbTransaction;
        conceptId: ConceptId;
    }): Promise<OperationConcept | null> {
        const criteria: OperationConceptSearchCriteria = {
            filters: [
                {
                    field: OperationConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: conceptId,
                    },
                },
            ],
        };
        const dbOperationConcepts = await OperationConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbOperationConcepts.length) {
            return null;
        }
        const dbOperationConcept = dbOperationConcepts[0];
        const operationConcept = dbOperationConcept.toDomain();
        return operationConcept;
    }

    public static async findOperationConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<OperationConcept[]> {
        const criteria: OperationConceptSearchCriteria = {
            filters: [
                {
                    field: OperationConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: conceptIds,
                    },
                },
            ],
        };
        const dbOperationConcepts = await OperationConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const operationConcepts = dbOperationConcepts.map((c) => c.toDomain());
        return operationConcepts;
    }

    public static async getOperationConceptById({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<OperationConcept> {
        const operationConcept =
            await DbOperationConceptManager.findOperationConceptById({
                conceptId: conceptId,
                transaction: transaction,
            });

        if (null == operationConcept) {
            throw new OperationConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        return operationConcept;
    }

    public static async getOperationConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<OperationConcept[]> {
        const operationConcepts =
            await DbOperationConceptManager.findOperationConceptsByIdInBulk({
                conceptIds: conceptIds,
                transaction: transaction,
            });

        if (conceptIds.length !== operationConcepts.length) {
            const exceptions = [];
            const foundIdValues = operationConcepts.map((c) => c.id.shortValue);
            for (const conceptId of conceptIds) {
                if (foundIdValues.includes(conceptId.shortValue)) {
                    continue;
                }
                const exception = new OperationConceptNotFoundException({
                    id: conceptId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return operationConcepts;
    }
}
