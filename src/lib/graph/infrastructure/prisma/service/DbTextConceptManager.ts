import type { DbTransaction } from "../../../../shared/infrastructure/prisma/model/DbTransaction";
import type { TextConceptSearchCriteria } from "../../../domain/model/TextConcept";
import type { TextConceptValue } from "../../../domain/model/TextConcept";
import { ConceptId } from "../../../domain/model/ConceptId";
import { DbGraphManager } from "./DbGraphManager";
import { DbTextConcept } from "../model/DbTextConcept";
import { ID_DATAKORO_TEXT } from "../../../domain/model/ConceptId";
import { TextConcept } from "../../../domain/model/TextConcept";
import { TextConceptField } from "../../../domain/model/TextConcept";
import { TextConceptNotFoundException } from "../../../../shared/domain/model/DomainException";
import { TextConceptSqlExecutor } from "../statement/TextConceptSqlExecutor";
import { TextFilterTypeValue } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbTextConceptManager {
    public static async addTextConcept({
        transaction,
        value,
    }: {
        transaction: DbTransaction;
        value: TextConceptValue;
    }): Promise<TextConcept> {
        const concept = await DbGraphManager.addConcept({
            transaction: transaction,
            abstractionId: ID_DATAKORO_TEXT,
        });

        const textConcept = TextConcept.create({
            conceptId: concept.id,
            value: value,
            transactionConceptDate: transaction.currentTransactionConceptDate,
        });

        const dbTextConcept = DbTextConcept.fromDomain(textConcept);
        await TextConceptSqlExecutor.insert(
            transaction.prismaTx,
            dbTextConcept,
        );

        return textConcept;
    }

    public static async findTextConceptById({
        transaction,
        conceptId,
    }: {
        transaction: DbTransaction;
        conceptId: ConceptId;
    }): Promise<TextConcept | null> {
        const criteria: TextConceptSearchCriteria = {
            filters: [
                {
                    field: TextConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: conceptId,
                    },
                },
            ],
        };
        const dbTextConcepts = await TextConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbTextConcepts.length) {
            return null;
        }
        const dbTextConcept = dbTextConcepts[0];
        const textConcept = dbTextConcept.toDomain();
        return textConcept;
    }

    public static async findTextConceptByValue({
        transaction,
        value,
    }: {
        transaction: DbTransaction;
        value: TextConceptValue;
    }): Promise<TextConcept | null> {
        const criteria: TextConceptSearchCriteria = {
            filters: [
                {
                    field: TextConceptField.Value,
                    filter: {
                        caseSensitive: true,
                        type: TextFilterTypeValue.IsEqualTo,
                        value: value.value,
                    },
                },
            ],
        };
        const dbTextConcepts = await TextConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbTextConcepts.length) {
            return null;
        }
        const dbTextConcept = dbTextConcepts[0];
        const textConcept = dbTextConcept.toDomain();
        return textConcept;
    }

    public static async findTextConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<TextConcept[]> {
        const criteria: TextConceptSearchCriteria = {
            filters: [
                {
                    field: TextConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: conceptIds,
                    },
                },
            ],
        };
        const dbTextConcepts = await TextConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const textConcepts = dbTextConcepts.map((c) => c.toDomain());
        return textConcepts;
    }

    public static async getTextConceptById({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<TextConcept> {
        const textConcept = await DbTextConceptManager.findTextConceptById({
            conceptId: conceptId,
            transaction: transaction,
        });

        if (null == textConcept) {
            throw new TextConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        return textConcept;
    }

    public static async getTextConceptByValue({
        value,
        transaction,
    }: {
        value: TextConceptValue;
        transaction: DbTransaction;
    }): Promise<TextConcept> {
        const textConcept = await DbTextConceptManager.findTextConceptByValue({
            transaction: transaction,
            value: value,
        });

        if (null == textConcept) {
            throw new TextConceptNotFoundException({
                value: value.value,
            });
        }

        return textConcept;
    }

    public static async getTextConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<TextConcept[]> {
        const textConcepts =
            await DbTextConceptManager.findTextConceptsByIdInBulk({
                conceptIds: conceptIds,
                transaction: transaction,
            });

        if (conceptIds.length !== textConcepts.length) {
            const exceptions = [];
            const foundIdValues = textConcepts.map((c) => c.id.shortValue);
            for (const conceptId of conceptIds) {
                if (foundIdValues.includes(conceptId.shortValue)) {
                    continue;
                }
                const exception = new TextConceptNotFoundException({
                    id: conceptId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return textConcepts;
    }
}
