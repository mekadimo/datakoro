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
    public static async addNumberConcept({
        transaction,
        value,
    }: {
        transaction: DbTransaction;
        value: NumberConceptValue;
    }): Promise<NumberConcept> {
        const concept = await DbGraphManager.addConcept({
            transaction: transaction,
            abstractionId: ID_DATAKORO_NUMBER,
        });

        const numberConcept = NumberConcept.create({
            conceptId: concept.id,
            value: value,
            transactionConceptDate: transaction.concept.date,
        });

        const dbNumberConcept = DbNumberConcept.fromDomain(numberConcept);
        await NumberConceptSqlExecutor.insert(
            transaction.prismaTx,
            dbNumberConcept,
        );

        return numberConcept;
    }

    public static async findNumberConceptById({
        transaction,
        conceptId,
    }: {
        transaction: DbTransaction;
        conceptId: ConceptId;
    }): Promise<NumberConcept | null> {
        const criteria: NumberConceptSearchCriteria = {
            filters: [
                {
                    field: NumberConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: conceptId,
                    },
                },
            ],
        };
        const dbNumberConcepts = await NumberConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbNumberConcepts.length) {
            return null;
        }
        const dbNumberConcept = dbNumberConcepts[0];
        const numberConcept = dbNumberConcept.toDomain();
        return numberConcept;
    }

    public static async findNumberConceptByValue({
        transaction,
        value,
    }: {
        transaction: DbTransaction;
        value: NumberConceptValue;
    }): Promise<NumberConcept | null> {
        const criteria: NumberConceptSearchCriteria = {
            filters: [
                {
                    field: NumberConceptField.Value,
                    filter: {
                        type: DecimalNumberFilterType.IsEqualTo,
                        value: value.value,
                    },
                },
            ],
        };

        const dbNumberConcepts = await NumberConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbNumberConcepts.length) {
            return null;
        }
        const dbNumberConcept = dbNumberConcepts[0];

        const numberConcept = dbNumberConcept.toDomain();
        return numberConcept;
    }

    public static async findNumberConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<NumberConcept[]> {
        const criteria: NumberConceptSearchCriteria = {
            filters: [
                {
                    field: NumberConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: conceptIds,
                    },
                },
            ],
        };
        const dbNumberConcepts = await NumberConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const numberConcepts = dbNumberConcepts.map((c) => c.toDomain());
        return numberConcepts;
    }

    public static async getNumberConceptById({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<NumberConcept> {
        const numberConcept =
            await DbNumberConceptManager.findNumberConceptById({
                conceptId: conceptId,
                transaction: transaction,
            });

        if (null == numberConcept) {
            throw new NumberConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        return numberConcept;
    }

    public static async getNumberConceptByValue({
        value,
        transaction,
    }: {
        value: NumberConceptValue;
        transaction: DbTransaction;
    }): Promise<NumberConcept> {
        const numberConcept =
            await DbNumberConceptManager.findNumberConceptByValue({
                transaction: transaction,
                value: value,
            });

        if (null == numberConcept) {
            throw new NumberConceptNotFoundException({
                value: value.value,
            });
        }

        return numberConcept;
    }

    public static async getNumberConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<NumberConcept[]> {
        const numberConcepts =
            await DbNumberConceptManager.findNumberConceptsByIdInBulk({
                conceptIds: conceptIds,
                transaction: transaction,
            });

        if (conceptIds.length !== numberConcepts.length) {
            const exceptions = [];
            const foundIdValues = numberConcepts.map((c) => c.id.shortValue);
            for (const conceptId of conceptIds) {
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
