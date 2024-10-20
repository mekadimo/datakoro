import type { DbTransaction } from "../../../../operation/infrastructure/prisma/model/DbTransaction";
import type { RawRelationSearchCriteria } from "../../../domain/model/Relation";
import { RawRelation } from "../../../domain/model/Relation";
import { RawRelationField } from "../../../domain/model/Relation";
import { RawRelationSqlExecutor } from "../statement/RawRelationSqlExecutor";
import { RelationId } from "../../../domain/model/Relation";
import { RelationNotFoundException } from "../../../../shared/domain/model/DomainException";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbRawRelationManager {
    public static async findRawRelationById(input: {
        relationId: RelationId;
        transaction: DbTransaction;
    }): Promise<RawRelation | null> {
        const criteria: RawRelationSearchCriteria = {
            filters: [
                {
                    field: RawRelationField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.relationId,
                    },
                },
            ],
        };
        const dbRawRelations = await RawRelationSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbRawRelations.length) {
            return null;
        }
        const dbRawRelation = dbRawRelations[0];
        const rawRelation = dbRawRelation.toDomain();
        return rawRelation;
    }

    public static async findRawRelationsByIdInBulk(input: {
        relationIds: RelationId[];
        transaction: DbTransaction;
    }): Promise<RawRelation[]> {
        const criteria: RawRelationSearchCriteria = {
            filters: [
                {
                    field: RawRelationField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.relationIds,
                    },
                },
            ],
        };
        const dbRawRelations = await RawRelationSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        const rawRelations = dbRawRelations.map((ar) => ar.toDomain());
        return rawRelations;
    }

    public static async getRawRelationById(input: {
        relationId: RelationId;
        transaction: DbTransaction;
    }): Promise<RawRelation> {
        const rawRelation = await DbRawRelationManager.findRawRelationById({
            relationId: input.relationId,
            transaction: input.transaction,
        });

        if (null == rawRelation) {
            throw new RelationNotFoundException({
                id: input.relationId.shortValue,
            });
        }

        return rawRelation;
    }

    public static async getRawRelationsByIdInBulk(input: {
        relationIds: RelationId[];
        transaction: DbTransaction;
    }): Promise<RawRelation[]> {
        const rawRelations =
            await DbRawRelationManager.findRawRelationsByIdInBulk({
                relationIds: input.relationIds,
                transaction: input.transaction,
            });

        if (input.relationIds.length !== rawRelations.length) {
            const exceptions = [];
            const foundRelationIdShortValues = rawRelations.map(
                (c) => c.id.shortValue,
            );
            for (const relationId of input.relationIds) {
                if (
                    foundRelationIdShortValues.includes(relationId.shortValue)
                ) {
                    continue;
                }
                const exception = new RelationNotFoundException({
                    id: relationId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return rawRelations;
    }

    public static async searchRawRelations(input: {
        criteria: RawRelationSearchCriteria;
        transaction: DbTransaction;
    }): Promise<RawRelation[]> {
        const dbRelations = await RawRelationSqlExecutor.select(
            input.transaction.prismaTx,
            input.criteria,
        );
        const relations = dbRelations.map((r) => r.toDomain());
        return relations;
    }
}
