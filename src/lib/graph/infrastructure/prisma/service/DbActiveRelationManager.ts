import type { ActiveRelationSearchCriteria } from "../../../domain/model/Relation";
import type { DbTransaction } from "../../../../operation/infrastructure/prisma/model/DbTransaction";
import { ActiveRelation } from "../../../domain/model/Relation";
import { ActiveRelationField } from "../../../domain/model/Relation";
import { ActiveRelationSqlExecutor } from "../statement/ActiveRelationSqlExecutor";
import { DbRawRelation } from "../model/DbRawRelation";
import { DbRelationRuleManager } from "../../../../operation/infrastructure/prisma/service/DbRelationRuleManager";
import { RawRelation } from "../../../domain/model/Relation";
import { RawRelationSqlExecutor } from "../statement/RawRelationSqlExecutor";
import { RelationId } from "../../../domain/model/Relation";
import { RelationNotFoundException } from "../../../../shared/domain/model/DomainException";
import { RelationOrderNumber } from "../../../domain/model/Relation";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbActiveRelationManager {
    public static async deleteRelation(input: {
        relationId: RelationId;
        transaction: DbTransaction;
    }): Promise<RawRelation> {
        const relation = await DbActiveRelationManager.getActiveRelationById({
            relationId: input.relationId,
            transaction: input.transaction,
        });

        // TODO: Avoid deleting some concepts (by self abstraction) and relations
        //       that should never be deleted.

        const rawRelation = relation.toRaw();
        rawRelation.setInactive({
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
        });

        const dbRawRelation = DbRawRelation.fromDomain(rawRelation);
        await RawRelationSqlExecutor.insert(
            input.transaction.prismaTx,
            dbRawRelation,
        );

        // TODO: Add task to inheritance system (be careful!!)

        return rawRelation;
    }

    public static async findActiveRelationById(input: {
        relationId: RelationId;
        transaction: DbTransaction;
    }): Promise<ActiveRelation | null> {
        const criteria: ActiveRelationSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.relationId,
                    },
                },
            ],
        };
        const dbActiveRelations = await ActiveRelationSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbActiveRelations.length) {
            return null;
        }
        const dbActiveRelation = dbActiveRelations[0];
        const activeRelation = dbActiveRelation.toDomain();
        return activeRelation;
    }

    public static async findActiveRelationsByIdInBulk(input: {
        relationIds: RelationId[];
        transaction: DbTransaction;
    }): Promise<ActiveRelation[]> {
        const criteria: ActiveRelationSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.relationIds,
                    },
                },
            ],
        };
        const dbActiveRelations = await ActiveRelationSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        const activeRelations = dbActiveRelations.map((ar) => ar.toDomain());
        return activeRelations;
    }

    public static async getActiveRelationById(input: {
        relationId: RelationId;
        transaction: DbTransaction;
    }): Promise<ActiveRelation> {
        const activeRelation =
            await DbActiveRelationManager.findActiveRelationById({
                relationId: input.relationId,
                transaction: input.transaction,
            });

        if (null == activeRelation) {
            throw new RelationNotFoundException({
                id: input.relationId.shortValue,
            });
        }

        return activeRelation;
    }

    public static async getActiveRelationsByIdInBulk(input: {
        relationIds: RelationId[];
        transaction: DbTransaction;
    }): Promise<ActiveRelation[]> {
        const activeRelations =
            await DbActiveRelationManager.findActiveRelationsByIdInBulk({
                relationIds: input.relationIds,
                transaction: input.transaction,
            });

        if (input.relationIds.length !== activeRelations.length) {
            const exceptions = [];
            const foundRelationIdShortValues = activeRelations.map(
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

        return activeRelations;
    }

    public static async updateRelationOrder(input: {
        relationId: RelationId;
        orderNumber: RelationOrderNumber;
        transaction: DbTransaction;
    }): Promise<ActiveRelation> {
        const relation = await DbActiveRelationManager.getActiveRelationById({
            transaction: input.transaction,
            relationId: input.relationId,
        });

        await DbRelationRuleManager.assertRelationOrderCanBeUpdated({
            transaction: input.transaction,
            relation: relation,
        });

        relation.updateOrder({
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
            orderNumber: input.orderNumber,
        });
        const rawRelation = relation.toRaw();
        const dbRelation = DbRawRelation.fromDomain(rawRelation);
        await RawRelationSqlExecutor.insert(
            input.transaction.prismaTx,
            dbRelation,
        );

        // TODO: Add task to inheritance system
        // TODO: If original relation, update ALL orders of concretions

        return relation;
    }
}
