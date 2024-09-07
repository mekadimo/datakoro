import type { DbTransaction } from "../../../../shared/infrastructure/prisma/model/DbTransaction";
import type { RawRelationSearchCriteria } from "../../../domain/model/Relation";
import { RawRelation } from "../../../domain/model/Relation";
import { RawRelationField } from "../../../domain/model/Relation";
import { RawRelationSqlExecutor } from "../statement/RawRelationSqlExecutor";
import { RelationId } from "../../../domain/model/Relation";
import { RelationNotFoundException } from "../../../../shared/domain/model/DomainException";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbRawRelationManager {
    public static async findRawRelationById({
        relationId,
        transaction,
    }: {
        relationId: RelationId;
        transaction: DbTransaction;
    }): Promise<RawRelation | null> {
        const criteria: RawRelationSearchCriteria = {
            filters: [
                {
                    field: RawRelationField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: relationId,
                    },
                },
            ],
        };
        const dbRawRelations = await RawRelationSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbRawRelations.length) {
            return null;
        }
        const dbRawRelation = dbRawRelations[0];
        const rawRelation = dbRawRelation.toDomain();
        return rawRelation;
    }

    public static async findRawRelationsByIdInBulk({
        relationIds,
        transaction,
    }: {
        relationIds: RelationId[];
        transaction: DbTransaction;
    }): Promise<RawRelation[]> {
        const criteria: RawRelationSearchCriteria = {
            filters: [
                {
                    field: RawRelationField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: relationIds,
                    },
                },
            ],
        };
        const dbRawRelations = await RawRelationSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const rawRelations = dbRawRelations.map((ar) => ar.toDomain());
        return rawRelations;
    }

    public static async getRawRelationById({
        relationId,
        transaction,
    }: {
        relationId: RelationId;
        transaction: DbTransaction;
    }): Promise<RawRelation> {
        const rawRelation = await DbRawRelationManager.findRawRelationById({
            relationId: relationId,
            transaction: transaction,
        });

        if (null == rawRelation) {
            throw new RelationNotFoundException({ id: relationId.shortValue });
        }

        return rawRelation;
    }

    public static async getRawRelationsByIdInBulk({
        relationIds,
        transaction,
    }: {
        relationIds: RelationId[];
        transaction: DbTransaction;
    }): Promise<RawRelation[]> {
        const rawRelations =
            await DbRawRelationManager.findRawRelationsByIdInBulk({
                relationIds: relationIds,
                transaction: transaction,
            });

        if (relationIds.length !== rawRelations.length) {
            const exceptions = [];
            const foundRelationIdShortValues = rawRelations.map(
                (c) => c.id.shortValue,
            );
            for (const relationId of relationIds) {
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

    public static async searchRawRelations({
        criteria,
        transaction,
    }: {
        criteria: RawRelationSearchCriteria;
        transaction: DbTransaction;
    }): Promise<RawRelation[]> {
        const dbRelations = await RawRelationSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const relations = dbRelations.map((r) => r.toDomain());
        return relations;
    }
}
