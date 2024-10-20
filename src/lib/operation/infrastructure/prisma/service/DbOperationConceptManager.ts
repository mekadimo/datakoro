import type { ConceptId } from "../../../../graph/domain/model/ConceptId";
import type { DbTransaction } from "../model/DbTransaction";
import type { OperationConceptSearchCriteria } from "../../../domain/model/OperationConcept";
import { OperationConcept } from "../../../domain/model/OperationConcept";
import { OperationConceptField } from "../../../domain/model/OperationConcept";
import { OperationConceptNotFoundException } from "../../../../shared/domain/model/DomainException";
import { OperationConceptSqlExecutor } from "../statement/OperationConceptSqlExecutor";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbOperationConceptManager {
    public static async findOperationConceptById(input: {
        transaction: DbTransaction;
        conceptId: ConceptId;
    }): Promise<OperationConcept | null> {
        const criteria: OperationConceptSearchCriteria = {
            filters: [
                {
                    field: OperationConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.conceptId,
                    },
                },
            ],
        };
        const dbOperationConcepts = await OperationConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbOperationConcepts.length) {
            return null;
        }
        const dbOperationConcept = dbOperationConcepts[0];
        const operationConcept = dbOperationConcept.toDomain();
        return operationConcept;
    }

    public static async findOperationConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<OperationConcept[]> {
        const criteria: OperationConceptSearchCriteria = {
            filters: [
                {
                    field: OperationConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.conceptIds,
                    },
                },
            ],
        };
        const dbOperationConcepts = await OperationConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        const operationConcepts = dbOperationConcepts.map((c) => c.toDomain());
        return operationConcepts;
    }

    public static async getOperationConceptById(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<OperationConcept> {
        const operationConcept =
            await DbOperationConceptManager.findOperationConceptById({
                conceptId: input.conceptId,
                transaction: input.transaction,
            });

        if (null == operationConcept) {
            throw new OperationConceptNotFoundException({
                id: input.conceptId.shortValue,
            });
        }

        return operationConcept;
    }

    public static async getOperationConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<OperationConcept[]> {
        const operationConcepts =
            await DbOperationConceptManager.findOperationConceptsByIdInBulk({
                conceptIds: input.conceptIds,
                transaction: input.transaction,
            });

        if (input.conceptIds.length !== operationConcepts.length) {
            const exceptions = [];
            const foundIdValues = operationConcepts.map((c) => c.id.shortValue);
            for (const conceptId of input.conceptIds) {
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
