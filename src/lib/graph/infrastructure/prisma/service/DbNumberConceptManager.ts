import type { DbTransaction } from "../../../../operation/infrastructure/prisma/model/DbTransaction";
import type { NumberConceptSearchCriteria } from "../../../domain/model/NumberConcept";
import type { NumberConceptValue } from "../../../domain/model/NumberConcept";
import { ConceptId } from "../../../domain/model/ConceptId";
import { DbGraphManager } from "./DbGraphManager";
import { DbNumberConcept } from "../model/DbNumberConcept";
import { DecimalNumberFilterType } from "../../../../shared/domain/model/Filter";
import { ID_DATAKORO_NUMBER } from "../../../domain/model/ConceptId";
import { NumberConcept } from "../../../domain/model/NumberConcept";
import { NumberConceptField } from "../../../domain/model/NumberConcept";
import { NumberConceptNotFoundException } from "../../../../shared/domain/model/DomainException";
import { NumberConceptSqlExecutor } from "../statement/NumberConceptSqlExecutor";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbNumberConceptManager {
    public static async addNumberConcept(input: {
        transaction: DbTransaction;
        value: NumberConceptValue;
    }): Promise<NumberConcept> {
        const concept = await DbGraphManager.addConcept({
            transaction: input.transaction,
            abstractionId: ID_DATAKORO_NUMBER,
        });

        const numberConcept = NumberConcept.create({
            conceptId: concept.id,
            value: input.value,
            transactionConceptDate: input.transaction.concept.date,
        });

        const dbNumberConcept = DbNumberConcept.fromDomain(numberConcept);
        await NumberConceptSqlExecutor.insert(
            input.transaction.prismaTx,
            dbNumberConcept,
        );

        return numberConcept;
    }

    public static async findNumberConceptById(input: {
        transaction: DbTransaction;
        conceptId: ConceptId;
    }): Promise<NumberConcept | null> {
        const criteria: NumberConceptSearchCriteria = {
            filters: [
                {
                    field: NumberConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.conceptId,
                    },
                },
            ],
        };
        const dbNumberConcepts = await NumberConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbNumberConcepts.length) {
            return null;
        }
        const dbNumberConcept = dbNumberConcepts[0];
        const numberConcept = dbNumberConcept.toDomain();
        return numberConcept;
    }

    public static async findNumberConceptByValue(input: {
        transaction: DbTransaction;
        value: NumberConceptValue;
    }): Promise<NumberConcept | null> {
        const criteria: NumberConceptSearchCriteria = {
            filters: [
                {
                    field: NumberConceptField.Value,
                    filter: {
                        type: DecimalNumberFilterType.IsEqualTo,
                        value: input.value.value,
                    },
                },
            ],
        };

        const dbNumberConcepts = await NumberConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbNumberConcepts.length) {
            return null;
        }
        const dbNumberConcept = dbNumberConcepts[0];

        const numberConcept = dbNumberConcept.toDomain();
        return numberConcept;
    }

    public static async findNumberConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<NumberConcept[]> {
        const criteria: NumberConceptSearchCriteria = {
            filters: [
                {
                    field: NumberConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.conceptIds,
                    },
                },
            ],
        };
        const dbNumberConcepts = await NumberConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        const numberConcepts = dbNumberConcepts.map((c) => c.toDomain());
        return numberConcepts;
    }

    public static async getNumberConceptById(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<NumberConcept> {
        const numberConcept =
            await DbNumberConceptManager.findNumberConceptById({
                conceptId: input.conceptId,
                transaction: input.transaction,
            });

        if (null == numberConcept) {
            throw new NumberConceptNotFoundException({
                id: input.conceptId.shortValue,
            });
        }

        return numberConcept;
    }

    public static async getNumberConceptByValue(input: {
        value: NumberConceptValue;
        transaction: DbTransaction;
    }): Promise<NumberConcept> {
        const numberConcept =
            await DbNumberConceptManager.findNumberConceptByValue({
                transaction: input.transaction,
                value: input.value,
            });

        if (null == numberConcept) {
            throw new NumberConceptNotFoundException({
                value: input.value.value,
            });
        }

        return numberConcept;
    }

    public static async getNumberConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<NumberConcept[]> {
        const numberConcepts =
            await DbNumberConceptManager.findNumberConceptsByIdInBulk({
                conceptIds: input.conceptIds,
                transaction: input.transaction,
            });

        if (input.conceptIds.length !== numberConcepts.length) {
            const exceptions = [];
            const foundIdValues = numberConcepts.map((c) => c.id.shortValue);
            for (const conceptId of input.conceptIds) {
                if (foundIdValues.includes(conceptId.shortValue)) {
                    continue;
                }
                const exception = new NumberConceptNotFoundException({
                    id: conceptId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return numberConcepts;
    }
}
